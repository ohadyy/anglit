import { build } from "./build";

// Platinum I · Meridian
export const meridian = build(1, {
  sentence: [
    [
      "Although the senator's speech was officially a call for unity, its ____ tone left many listeners convinced that he intended to provoke his rivals.",
      "hostile",
      ["gentle","hesitant","neutral"],
      "Although מציג ניגוד: רשמית קריאה לאחדות, אבל הטון גרם להרגשה של התגרות. hostile = עוין.",
    ],
    [
      "The committee's report was so ____ that even specialists had difficulty determining what, precisely, it recommended.",
      "vague",
      ["polite","optimistic","original"],
      "אפילו מומחים התקשו להבין מה כתוב, כלומר הדוח עמום. vague = מעורפל, לא ברור.",
    ],
    [
      "Far from being a ____ gesture, the donation was a carefully calculated move designed to improve the company's image before the trial.",
      "spontaneous",
      ["planned","strategic","deliberate"],
      "Far from = ההפך מ־. התרומה הייתה מחושבת, ולכן לא ספונטנית. שלוש האפשרויות האחרות מתארות בדיוק את מה שהיא כן הייתה.",
    ],
    [
      "The botanist's tireless ____ finally paid off when, after nine years of cross-breeding, she produced a strain of wheat resistant to drought.",
      "persistence",
      ["luck","modesty","humor"],
      "תשע שנים בלי לעצור: persistence = התמדה.",
    ],
    [
      "Rather than ____ the problem, the manager chose to acknowledge it openly, a decision that earned him the respect of his staff.",
      "conceal",
      ["examine","predict","celebrate"],
      "Rather than = במקום. ההפך מלהודות בגלוי הוא להסתיר. conceal = להסתיר.",
    ],
    [
      "The painter's early work was dismissed as ____, but critics now regard its apparent simplicity as the result of rigorous discipline.",
      "shallow",
      ["careful","ambitious","profound"],
      "הפשטות רק נראית כך, ובעבר חשבו שהיא שטחית. shallow = שטחי.",
    ],
    [
      "Her ____ remarks, delivered with a smile that never reached her eyes, wounded the guests more deeply than an open insult would have.",
      "indirect",
      ["honest","noisy","naive"],
      "פגעה יותר מעלבון גלוי, כלומר הערות עקיפות. indirect = עקיף.",
    ],
    [
      "Because the town's economy depended almost ____ on a single factory, its closure left thousands without any alternative source of income.",
      "entirely",
      ["rarely","barely","slightly"],
      "סגירת מפעל אחד השאירה אלפים בלי הכנסה, ולכן הכלכלה הייתה תלויה כמעט כולה בו. almost entirely = כמעט לגמרי.",
    ],
    [
      "The ambassador's ____ refusal to discuss the matter, even in private, suggested that the negotiations had reached an impasse.",
      "stubborn",
      ["friendly","hesitant","casual"],
      "גם בפרטיות, וזה סימן למבוי סתום: סירוב עיקש. stubborn = עקשן.",
    ],
    [
      "The new regulations were intended to ____ the spread of misinformation, yet critics argued that they would, in practice, silence legitimate dissent.",
      "limit",
      ["encourage","record","excuse"],
      "מטרת התקנות היא לצמצם הפצת מידע שגוי. limit = להגביל.",
    ],
    [
      "The politician's reputation for ____ was undeserved; in private he was known to change his position whenever it suited him.",
      "consistency",
      ["humor","eloquence","thrift"],
      "מי שמשנה עמדה לפי הנוחות לא ראוי למוניטין של עקביות. consistency = עקביות.",
    ],
    [
      "The archaeologists were reluctant to draw ____ conclusions from a single fragment of pottery, since the evidence could support several competing interpretations.",
      "definite",
      ["tentative","decorative","friendly"],
      "יש כמה פרשנויות, ולכן נמנעים ממסקנות החלטיות. definite = סופי, החלטי. tentative = זהיר וזמני, ולכן לא נמנעים ממנו.",
    ],
  ],
  restatement: [
    [
      "Not until the auditors examined the ledgers did the board realize how much money had been lost.",
      "The board realized the extent of the loss only after the auditors had examined the ledgers.",
      [
        "The board knew about the loss before the auditors examined the ledgers.",
        "The auditors examined the ledgers because the board had already realized how much money was lost.",
        "The board never learned how much money had been lost, despite the auditors' examination.",
      ],
      "Not until = רק אחרי ש־. עד הבדיקה לא ידעו, ורק אחריה הבינו את היקף ההפסד.",
    ],
    [
      "Had the evacuation been ordered earlier, far fewer residents would have been injured.",
      "The late evacuation order resulted in more injuries than an earlier one would have.",
      [
        "The evacuation was ordered early, so few residents were injured.",
        "Fewer residents were injured because the evacuation order was delayed.",
        "The residents were injured despite an early evacuation order.",
      ],
      "Had + V3 הוא תנאי שלישי בלי if: הפינוי לא הוצא מוקדם, ולכן היו יותר פצועים.",
    ],
    [
      "The more the critics condemned the play, the more eager the public became to see it.",
      "Criticism of the play only increased the public's desire to see it.",
      [
        "The critics condemned the play because the public was so eager to see it.",
        "Public interest in the play fell as the critics condemned it.",
        "The critics became more eager to condemn the play as audiences grew.",
      ],
      "The more... the more = ככל ש... כך. הביקורת הגבירה את הרצון לראות, לא הפחיתה אותו ולא נבעה ממנו.",
    ],
    [
      "Few scientists would deny that the findings, however preliminary, merit further investigation.",
      "Most scientists agree that the findings deserve further study, even though they are not yet conclusive.",
      [
        "Several scientists deny that preliminary findings can deserve further investigation.",
        "Hardly any scientists consider the preliminary findings worthy of further study.",
        "The findings are conclusive, so scientists see no need for further investigation.",
      ],
      "Few would deny = כמעט כולם מסכימים (שלילה כפולה). however preliminary = גם אם הממצאים ראשוניים בלבד.",
    ],
    [
      "She would sooner resign than sign a statement she believes to be false.",
      "She prefers to resign rather than sign a statement she believes to be untrue.",
      [
        "She will resign soon, after signing a statement she believes to be false.",
        "She would sign a statement she believes to be false only if she were allowed to resign.",
        "She regrets signing a false statement and has decided to resign.",
      ],
      "would sooner A than B = מעדיפה A על פני B. היא מעדיפה להתפטר מאשר לחתום.",
    ],
    [
      "The proposal was rejected, not because it was flawed, but because it arrived after the deadline.",
      "The proposal was turned down for being late rather than for being flawed.",
      [
        "The proposal was turned down both for its flaws and for arriving late.",
        "The proposal arrived after the deadline because it was flawed.",
        "The proposal was accepted although it arrived after the deadline.",
      ],
      "not because A, but because B = לא בגלל A אלא בגלל B. הסיבה היחידה היא האיחור.",
    ],
  ],
  passage: {
    title: "The Politics of the Map",
    paragraphs: [
      "To most people, a map is a neutral document, a faithful reduction of the landscape to paper. Historians of cartography have long argued otherwise. Every map, they contend, is an argument: decisions about what to include, what to omit and how to label what remains reflect the priorities of those who commission it. A sixteenth-century map of the Americas, for instance, rarely depicted the settlements of indigenous peoples with the same care as the forts of European colonizers, and the omission was not an oversight but a form of claim-making.",
      "The best-known illustration of this principle is the Mercator projection, devised in 1569 for navigators. Because it preserves compass bearings as straight lines, a sailor could plot a course with a ruler. The price was distortion of area: landmasses near the poles appear far larger than they are, so that Greenland seems comparable in size to Africa, which is in fact roughly fourteen times larger. Mercator never intended his map to rank the importance of nations, yet its ubiquity in classrooms for centuries may have subtly shaped how generations perceived the relative weight of the northern and southern hemispheres.",
      "Defenders of the projection object that the criticism is anachronistic. A tool designed for a specific purpose, they say, should not be condemned for failing at tasks it was never meant to perform. This defence has merit, but it overlooks an important point: the distortion becomes problematic only when a map designed for one purpose is pressed into service for another. The fault lies less with the cartographer than with the habits of the audience, who assume that a single image can answer every spatial question.",
      "Modern geographers have therefore adopted a more modest ambition. Rather than searching for a perfect projection, which mathematics has shown to be impossible, they encourage readers to ask what a given map was built to do. A map, in this view, is not a mirror but a lens: it brings certain features into sharp focus precisely by allowing others to blur.",
    ],
  },
  reading: [
    [
      "Which of the following best expresses the main point of the passage?",
      "Every map reflects choices and purposes, so readers should ask what a map was designed to do.",
      [
        "The Mercator projection should be abandoned in favor of a more accurate alternative.",
        "Early cartographers deliberately falsified their maps in order to deceive their rivals.",
        "Mathematical advances have finally made it possible to draw a distortion-free map.",
      ],
      "הפסקה הראשונה קובעת שמפה היא טיעון, והאחרונה מסכמת: לשאול למה המפה נבנתה. הפתרון המתמטי של מפה מושלמת מוגדר בטקסט כבלתי אפשרי.",
    ],
    [
      "Why does the author mention that Greenland appears comparable in size to Africa?",
      "To illustrate the distortion of area that the Mercator projection produces.",
      [
        "To prove that Mercator intended to exaggerate the importance of the northern nations.",
        "To show that modern geographers have corrected the error.",
        "To explain why sailors preferred other projections.",
      ],
      "גרינלנד היא דוגמה לעיוות השטחים. הטקסט אומר במפורש שמרקטור לא התכוון לדרג מדינות.",
      2,
    ],
    [
      "Which statement best describes the author's view of the defenders' argument in paragraph 3?",
      "It is partly justified but incomplete.",
      [
        "It is entirely mistaken.",
        "It is irrelevant to the debate.",
        "It is persuasive enough to end the controversy.",
      ],
      "המחבר אומר שיש בטענה ממש (has merit), אבל היא מתעלמת מנקודה חשובה (overlooks an important point).",
      3,
    ],
    [
      "In paragraph 3, the criticism of the projection is called \"anachronistic.\" This suggests that the criticism",
      "applies present-day expectations to something created in an earlier era.",
      [
        "was deliberately designed to mislead the public.",
        "contains more detail than the topic requires.",
        "expresses hostility toward the cartographer personally.",
      ],
      "anachronistic = שייך לתקופה אחרת. המגינים טוענים שאי אפשר לשפוט כלי של המאה ה־16 לפי משימות שמעולם לא נועד להן.",
      3,
    ],
    [
      "What does the author imply by describing a map as \"a lens\" rather than \"a mirror\"?",
      "A map brings some features into focus at the expense of others instead of reproducing everything faithfully.",
      [
        "A map magnifies distant regions so that they can be studied more closely.",
        "A map reflects the personality of the cartographer who made it.",
        "A map shows the world exactly as it is, but only from one angle.",
      ],
      "מראה משחזרת הכול, עדשה ממקדת. המשפט האחרון אומר שמיקוד בפרטים מסוימים בא על חשבון טשטוש של אחרים.",
      4,
    ],
  ],
});
