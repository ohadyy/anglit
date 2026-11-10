import { businessDetails } from "@/content/legal";

const handle = businessDetails.instagram.replace(/^@/, "");

export const site = {
  name: businessDetails.name,
  handle,
  url: "https://anglitpro.co.il",
  instagramUrl: `https://instagram.com/${handle}`,
  googleBusinessUrl: "https://share.google/dED0ymh15ilxz3jXb",
};
