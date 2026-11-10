// Text of the prefixes and suffixes lesson at /learn/affixes. Original writing for Anglit.

import { affixQuestions } from "./affixesBank";

export const affixesLesson = {
  seoTitle: "תחיליות וסופיות באמירנט: שיעור קצר ותרגול",
  seoDescription:
    "prefixes ו-suffixes: איך מפרקים מילה לשורש, תחילית וסופית כדי להבין אותה, ואיך הסופית אומרת לכם איזה סוג מילה המשפט צריך. שיעור קצר ושאלות לדוגמה.",
  title: "תחיליות וסופיות: לפרק מילה ולהבין אותה",
  intro:
    "לא חייבים להכיר כל מילה באמירנט. אם מפרקים מילה לשורש, תחילית וסופית, אפשר לנחש את המשמעות ואת סוג המילה. הסופית אומרת מה המילה (שם עצם, תואר, פועל או תואר פועל), והתחילית משנה את המשמעות. זה עוזר בפרק \"יצירת מילה\", בהשלמת משפטים ובמילים שלא פגשתם.",

  prefixesTitle: "תחיליות: מה הן משנות",
  prefixes: [
    { role: "שלילה", affixes: "un-, in-, im-, il-, ir-, dis-, non-", examples: "unusual, incorrect, impossible, illegal, irregular, dishonest, nonstop" },
    { role: "ביטול או היפוך", affixes: "de-, un-, dis-", examples: "decode, undo, disconnect" },
    { role: "שוב", affixes: "re-", examples: "rewrite, rebuild" },
    { role: "לפני / אחרי", affixes: "pre-, post-", examples: "prepay, postwar" },
    { role: "בטעות", affixes: "mis-", examples: "misread, misunderstand" },
    { role: "יותר מדי / פחות מדי", affixes: "over-, under-", examples: "overestimate, underestimate" },
    { role: "נגד", affixes: "anti-, counter-", examples: "antibiotic, counterattack" },
    { role: "יחד / בין / מעבר", affixes: "co-, inter-, trans-", examples: "coexist, international, transport" },
    { role: "מתחת / מעל", affixes: "sub-, super-", examples: "submarine, superhuman" },
    { role: "חצי / הרבה", affixes: "semi-, multi-", examples: "semicircle, multilingual" },
  ],

  suffixesTitle: "סופיות: מה הן אומרות על המילה",
  suffixes: [
    { role: "שם עצם", affixes: "-tion, -sion, -ment, -ness, -ity, -ance, -ence, -ship", examples: "creation, movement, kindness, ability, importance" },
    { role: "אדם (עושה הפעולה)", affixes: "-er, -or, -ist, -ian", examples: "teacher, actor, scientist, musician" },
    { role: "תואר", affixes: "-able, -ible, -ful, -less, -ous, -ive, -al, -ic, -ish", examples: "readable, helpful, careless, dangerous, creative" },
    { role: "פועל", affixes: "-ize, -ify, -en, -ate", examples: "modernize, simplify, strengthen, activate" },
    { role: "תואר פועל", affixes: "-ly", examples: "quickly, carefully" },
  ],

  trapsTitle: "ארבע מלכודות",
  traps: [
    "בין in-, im-, il- ו-ir- בוחרים לפי האות שאחרי התחילית: im- לפני b, m, p (impossible); il- לפני l (illegal); ir- לפני r (irregular); in- בשאר המקרים (incorrect). בין un- ל-in- אין כלל מוחלט, ולכן לומדים מילה מילה.",
    "-ful ו--less הפוכות: helpful (עוזר) מול helpless (חסר ישע). ההקשר קובע.",
    "-ly לא תמיד תואר פועל: friendly ו-lovely הן תארים.",
    "in- לא תמיד שלילה (inside, invade), ו-invaluable היא \"בעלת ערך רב מאוד\" ולא \"חסרת ערך\".",
  ],

  trickTitle: "הטריק בשלושה צעדים",
  trick: [
    "בודקים מה המשפט צריך: שם עצם אחרי the או 's, תואר לפני שם עצם, תואר פועל ליד פועל, פועל אחרי to.",
    "מפרקים כל תשובה לשורש וסופית ומוצאים את הסוג שלה.",
    "פוסלים תשובה שהסוג שלה לא מתאים, בלי להיכנס למשמעות.",
  ],

  tryTitle: "נסו בעצמכם",
  tryText: "שתי שאלות מהתרגול, עם הסבר אחרי כל תשובה.",

  ctaTitle: `${affixQuestions.length} שאלות על תחיליות וסופיות`,
  ctaText: "בוחרים את הצורה הנכונה, מנחשים משמעות מתוך החלקים ובוחרים את התחילית השלילית הנכונה. הסבר לכל תשובה, והטעויות נשמרות ב\"הטעויות שלי\".",
  ctaButton: "לתרגול המלא",
  ctaNote: "התרגול המלא במסלול בתשלום.",
};
