// Student results shown on the home page and the /ads landing page.
// Only first letters are shown, never full names. Score = first vs last exam taken on the site.
// Girls' avatars so far: 1, 3, 4, 5, 7, 9 (2, 6, 8 are boys) in /public/avatars.
export const results = [
  { letter: "נ", before: 99, after: 135, avatar: "/avatars/1.webp" },
  { letter: "ר", before: 107, after: 143, avatar: "/avatars/5.webp" },
  { letter: "ס", before: 116, after: 129, avatar: "/avatars/3.webp" },
];

export const resultsCopy = {
  title: "תוצאות אמיתיות, מבוגרי הסמינר.",
  sub: "וכן, זה תוך שבוע אחד.",
  // Only shown from this many students up, so a "average" never rests on one or two people
  minForAverage: 3,
  averageLabel: (avg: number) => `ממוצע שיפור: ${avg} נקודות`,
};
