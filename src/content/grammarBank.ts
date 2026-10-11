// Grammar-in-context items for exam tests 2–10 (the first test's grammar is in questions.ts).
// Original writing for Anglit. Each exam uses one set of four items (see examTests.ts).
// status: "approved" per the teacher's approval of the question bank.

import type { GrammarQuestion } from "./questions";

type Item = {
  id: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  trick?: string;
};

const items: (Item & { type: "grammar" })[] = [
  { id: "g2-1", type: "grammar", stem: "By the time the guests arrived, the cook ___ dinner.", options: ["already prepared", "has already prepared", "had already prepared", "was already preparing"], answer: 2, explanation: "הבישול קרה לפני הגעת האורחים, ולכן משתמשים ב-past perfect: had already prepared.", trick: "by the time + פעולה בעבר: השתמשו ב-had." },
  { id: "g2-2", type: "grammar", stem: "I wish I ___ more time to study for the exam.", options: ["have", "had", "will have", "having"], answer: 1, explanation: "אחרי wish לתיאור מצב שאינו קיים כרגע משתמשים בעבר פשוט: had.", trick: "wish + עבר פשוט מתאר משאלה על ההווה." },
  { id: "g2-3", type: "grammar", stem: "The students, together with their teacher, ___ visiting the museum on Friday.", options: ["is", "are", "was", "be"], answer: 1, explanation: "הנושא הוא students, ברבים. הביטוי together with לא משנה את ההסכמה, ולכן are.", trick: "together with לא הופך את הנושא ליחיד." },
  { id: "g2-4", type: "grammar", stem: "Not only ___ the report on time, but she also presented it clearly.", options: ["did she submit", "she submitted", "she has submitted", "submitted she"], answer: 0, explanation: "אחרי Not only באה היפוך: did she submit.", trick: "Not only בתחילת משפט דורש היפוך של הנושא והפועל." },
  { id: "g3-1", type: "grammar", stem: "Had I known about the traffic, I ___ a different route.", options: ["took", "would take", "would have taken", "have taken"], answer: 2, explanation: "זה משפט תנאי מסוג שלישי בצורת היפוך: Had I known... would have taken.", trick: "Had + נושא + חלק עבר הוא תנאי שלא התקיים." },
  { id: "g3-2", type: "grammar", stem: "Each of the players ___ a copy of the rulebook.", options: ["receive", "receives", "have received", "are receiving"], answer: 1, explanation: "Each מתייחס לכל אחד בנפרד ולכן הפועל ביחיד: receives.", trick: "each + פועל ביחיד." },
  { id: "g3-3", type: "grammar", stem: "The city council suggested that the road ___ repaired before winter.", options: ["is", "be", "was", "will be"], answer: 1, explanation: "אחרי suggest בתוך that משתמשים בצורת הבסיס: be repaired.", trick: "suggest + that + be." },
  { id: "g3-4", type: "grammar", stem: "The package, which ___ last week, finally arrived today.", options: ["was ordered", "ordered", "has ordered", "is ordering"], answer: 0, explanation: "החבילה הוזמנה, ולכן צורת הסביל: was ordered.", trick: "כשהנושא הוא זה שמקבל את הפעולה, השתמשו בסביל." },
  { id: "g4-1", type: "grammar", stem: "Hardly ___ the meeting started when the fire alarm went off.", options: ["had", "has", "did", "was"], answer: 0, explanation: "אחרי Hardly בא היפוך בעבר: Hardly had the meeting started when...", trick: "Hardly + had + נושא + חלק עבר ... when." },
  { id: "g4-2", type: "grammar", stem: "She insisted that everyone ___ on time for the presentation.", options: ["arrives", "arrive", "arrived", "to arrive"], answer: 1, explanation: "אחרי insist בתוך that משתמשים בצורת הבסיס: arrive.", trick: "insist + that + צורת הבסיס." },
  { id: "g4-3", type: "grammar", stem: "The new museum, ___ opened last year, attracts thousands of visitors.", options: ["which", "who", "whose", "what"], answer: 0, explanation: "במשפט עם פסיקים מתייחסים לדבר (museum) ולכן which.", trick: "אחרי פסיק מתייחסים לדבר עם which." },
  { id: "g4-4", type: "grammar", stem: "The new employee is ___ experienced than the others.", options: ["more", "most", "much", "very"], answer: 0, explanation: "בהשוואה עם than משתמשים ב-more + תואר. כאן: more experienced.", trick: "than תמיד מלווה ב-more." },
  { id: "g5-1", type: "grammar", stem: "If the train ___ on time, we would not have missed the concert.", options: ["ran", "had run", "would run", "runs"], answer: 1, explanation: "תנאי מסוג שלישי: had run בתנאי, would have missed בתוצאה.", trick: "התנאי בעבר משתמש ב-had + חלק עבר." },
  { id: "g5-2", type: "grammar", stem: "Neither of the two answers ___ correct.", options: ["is", "are", "were", "be"], answer: 0, explanation: "Neither מתייחס ליחיד, ולכן is.", trick: "neither + יחיד." },
  { id: "g5-3", type: "grammar", stem: "The manager asked us ___ the report by Monday.", options: ["finish", "to finish", "finishing", "finished"], answer: 1, explanation: "אחרי ask + אובייקט משתמשים ב-to + פועל: to finish.", trick: "ask someone to do." },
  { id: "g5-4", type: "grammar", stem: "The house ___ in 1920 and was restored last year.", options: ["built", "was built", "has built", "is building"], answer: 1, explanation: "הבית נבנה, לכן סביל: was built.", trick: "בית לא בונה את עצמו: סביל." },
  { id: "g6-1", type: "grammar", stem: "The report ___ finished by the time the manager returns.", options: ["will be", "is being", "has been", "was"], answer: 0, explanation: "הדוח ייגמר בעתיד, ולכן will be finished.", trick: "by the time בהווה, והתוצאה בעתיד." },
  { id: "g6-2", type: "grammar", stem: "I'd rather you ___ the door when you leave.", options: ["close", "closed", "closing", "to close"], answer: 1, explanation: "אחרי would rather בא עבר פשוט: closed.", trick: "would rather + עבר פשוט." },
  { id: "g6-3", type: "grammar", stem: "Despite ___ tired, she finished the marathon.", options: ["being", "to be", "was", "be"], answer: 0, explanation: "אחרי despite משתמשים ב-being + תואר.", trick: "despite + being." },
  { id: "g6-4", type: "grammar", stem: "Scarcely ___ the room when the lights went out.", options: ["had we entered", "we had entered", "did we enter", "we entered"], answer: 0, explanation: "אחרי Scarcely בא היפוך: had we entered.", trick: "Scarcely + had + נושא + חלק עבר." },
  { id: "g7-1", type: "grammar", stem: "Had she ___ earlier, she would have seen the performance.", options: ["arrived", "arrive", "arriving", "to arrive"], answer: 0, explanation: "תנאי מסוג שלישי בהיפוך: Had she arrived... would have seen.", trick: "Had + נושא + חלק עבר." },
  { id: "g7-2", type: "grammar", stem: "The number of students in the class ___ increased this year.", options: ["has", "have", "are", "were"], answer: 0, explanation: "The number of מתייחס ליחיד, ולכן has.", trick: "the number of = יחיד." },
  { id: "g7-3", type: "grammar", stem: "I'd like you ___ me the file before the meeting.", options: ["send", "sending", "to send", "sent"], answer: 2, explanation: "אחרי would like you משתמשים ב-to + פועל: to send.", trick: "would like + you + to." },
  { id: "g7-4", type: "grammar", stem: "The letter ___ yesterday, so it should arrive today.", options: ["mailed", "was mailed", "has mailed", "mails"], answer: 1, explanation: "המכתב נשלח, לכן סביל: was mailed.", trick: "כשהנושא מקבל את הפעולה: סביל." },
  { id: "g8-1", type: "grammar", stem: "The more you practice, ___ you will become.", options: ["the better", "good", "better", "the best"], answer: 0, explanation: "בהשוואה בכפולה משתמשים ב-the more... the better.", trick: "the more... the better." },
  { id: "g8-2", type: "grammar", stem: "Each of the students ___ to submit a short report.", options: ["are required", "is required", "require", "were requiring"], answer: 1, explanation: "Each מתייחס ליחיד, ולכן is required.", trick: "each + יחיד." },
  { id: "g8-3", type: "grammar", stem: "I'm sorry I ___ you yesterday; I was very busy.", options: ["didn't call", "haven't called", "don't call", "wasn't calling"], answer: 0, explanation: "הפעולה הייתה אתמול, ולכן עבר פשוט: didn't call.", trick: "yesterday = עבר פשוט." },
  { id: "g8-4", type: "grammar", stem: "No sooner ___ the phone rung than she answered it.", options: ["had", "has", "did", "was"], answer: 0, explanation: "אחרי No sooner בא היפוך בעבר: No sooner had the phone rung than...", trick: "No sooner + had + נושא + חלק עבר ... than." },
  { id: "g9-1", type: "grammar", stem: "The students ___ their homework when the power went out.", options: ["were finishing", "finished", "have finished", "will finish"], answer: 0, explanation: "פעולה מתמשכת שנקטעה: were finishing.", trick: "when + עבר פשוט לקטיעה של פעולה מתמשכת." },
  { id: "g9-2", type: "grammar", stem: "Please remind me ___ the tickets before we leave.", options: ["to buy", "buying", "buy", "bought"], answer: 0, explanation: "אחרי remind someone משתמשים ב-to + פועל: to buy.", trick: "remind + אובייקט + to." },
  { id: "g9-3", type: "grammar", stem: "Not until the results ___, did the team celebrate.", options: ["were announced", "announced", "are announced", "had announced"], answer: 0, explanation: "אחרי Not until בא היפוך: did the team celebrate, והתנאי הוא were announced.", trick: "Not until + משפט רגיל, ואז did + נושא." },
  { id: "g9-4", type: "grammar", stem: "The old bridge, ___ was built in 1890, will be closed for repairs.", options: ["which", "who", "where", "whom"], answer: 0, explanation: "במשפט עם פסיקים מתייחסים לדבר (bridge), ולכן which.", trick: "אחרי פסיק מתייחסים לדבר עם which." },
  { id: "g10-1", type: "grammar", stem: "If I ___ you, I would apologize immediately.", options: ["am", "was", "were", "be"], answer: 2, explanation: "בתנאי לא אמיתי משתמשים ב-were לכל הנושאים: If I were you.", trick: "If I were you." },
  { id: "g10-2", type: "grammar", stem: "The committee has decided that the deadline ___ extended.", options: ["is", "be", "will", "was being"], answer: 1, explanation: "אחרי decide בתוך that בסגנון רשמי משתמשים בצורת הבסיס: be extended.", trick: "decided that + be." },
  { id: "g10-3", type: "grammar", stem: "Only after the storm ___ the damage clearly.", options: ["we saw", "did we see", "we have seen", "saw we"], answer: 1, explanation: "אחרי Only after בא היפוך: did we see.", trick: "Only after + היפוך." },
  { id: "g10-4", type: "grammar", stem: "She has been working here ___ 2015.", options: ["since", "for", "during", "from"], answer: 0, explanation: "2015 היא נקודת זמן, ולכן since.", trick: "since + נקודת זמן, for + משך זמן." },
];

export const grammarQuestions: GrammarQuestion[] = items.map((it) => ({
  id: it.id,
  type: "grammar" as const,
  stem: it.stem,
  options: it.options,
  answer: it.answer,
  explanation: it.explanation,
  trick: it.trick,
  status: "approved" as const,
}));
