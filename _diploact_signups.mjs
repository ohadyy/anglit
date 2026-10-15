import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const envText = readFileSync(".env.local", "utf8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select u.name, u.phone, u.prior_score, o.status, o.cohort_id, o.created_at
  from orders o
  join "user" u on u.id = o.user_id
  where o.product = 'course' and o.cohort_id is not null
  order by o.created_at
`;
console.log(JSON.stringify(rows, null, 2));
console.log("TOTAL:", rows.length);
