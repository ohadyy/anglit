// Extra listening-comprehension clips for practice, grouped by difficulty (written 2026-11-12).
// Difficulty here is length, speed and the logic the question asks for, never rare words:
//   easy   (lx-e*)  one speaker, 27–36 s, details said plainly
//   medium (lx-m*)  50–61 s, a dialogue or a news item, details plus one reason
//   hard   (lx-h*)  65–103 s, faster, inference, attitude, a speaker correcting an assumption
// The older clips are placed by their length: lecN-a = easy, lecN-b and lecN-c = medium.
// Each clip has an illustration (public/brand/listening/<id>.webp) matching its topic and the speaker's gender.
// The scripts are original, voiced with ElevenLabs. Answer keys are the author's, awaiting the owner's review.
// Practice only: these questions are not part of any exam (see lib/examStructure.ts) and have no IRT level,
// so content/difficulty.ts must not list them.

import type { ListeningQuestion, Passage } from "./questions";
import type { LevelGroup } from "./practiceFacts";

type Options = ListeningQuestion["options"];

const clip = (id: string, title: string): Passage => ({ id, title, paragraphs: [], audio: `/audio/listening/${id}.mp3`, image: `/brand/listening/${id}.webp` });

export const listeningPassages: Passage[] = [
  clip("lx-e1", "קטע קצר: הודעה מהספרייה"),
  clip("lx-e2", "קטע קצר: הודעה ממרפאה"),
  clip("lx-e3", "קטע קצר: סיור בגן הבוטני"),
  clip("lx-e4", "קטע קצר: כללים במכון כושר"),
  clip("lx-m1", "קטע בינוני: שיחה על פרויקט"),
  clip("lx-m2", "קטע בינוני: איך דבורים מספרות איפה האוכל"),
  clip("lx-m3", "קטע בינוני: חדשות על שבילי אופניים"),
  clip("lx-m4", "קטע בינוני: למה בני נוער הולכים לישון מאוחר"),
  clip("lx-h1", "קטע ארוך: הרצאה על אפקט הפלצבו"),
  clip("lx-h2", "קטע ארוך: שיחה עם יועץ אקדמי"),
  clip("lx-h3", "קטע ארוך: הרצאה על נחלת הכלל"),
  clip("lx-h4", "קטע ארוך: שיחה על השקת אפליקציה"),
];

/** Level group of a listening clip, so the practice picker can filter by it */
export function listeningGroup(passageId: string): LevelGroup | undefined {
  if (passageId.startsWith("lx-e") || /^lec\d-a$/.test(passageId)) return "easy";
  if (passageId.startsWith("lx-m") || /^lec\d-[bc]$/.test(passageId)) return "medium";
  if (passageId.startsWith("lx-h")) return "hard";
  return undefined;
}

// Where the right answer goes, one slot per question in bank order: spread over A–D, never three in a row
const SLOTS = [
  1, 3, 0, 2, 2, 0, 3, 1, 0, 3, 1, 2, 3, 1, 2, 0, 1, 2, 0, 3,
  0, 2, 3, 1, 2, 0, 1, 3, 3, 1, 0, 2, 1, 3, 2, 0, 0, 1, 3, 2,
] as const;
let n = 0;

function q(id: string, passageId: string, stem: string, right: string, wrong: [string, string, string], explanation: string): ListeningQuestion {
  const answer = SLOTS[n++];
  const options = [...wrong.slice(0, answer), right, ...wrong.slice(answer)] as Options;
  return { id, type: "listening", passageId, stem, options, answer, explanation, status: "approved" };
}

export const listeningQuestions: ListeningQuestion[] = [
  // ---- easy ----
  q("lx-e1-1", "lx-e1", "How long will the library stay open on weekdays during the exam period?", "Until midnight", ["Until ten o'clock", "Until two in the afternoon", "Until eleven at night"], "בתקופת הבחינות הספרייה פתוחה עד חצות, במקום עד עשר בלילה."),
  q("lx-e1-2", "lx-e1", "What does the speaker say about the quiet study rooms?", "They can be booked online, for two hours at a time", ["They are open only on Fridays", "They must be booked at the front desk", "They can be booked for the whole day"], "את החדרים השקטים בקומה השנייה מזמינים באינטרנט, ולכל היותר לשעתיים."),
  q("lx-e2-1", "lx-e2", "Why does the clinic want to move Mr. Cohen's appointment?", "The doctor has to attend an urgent meeting", ["The doctor is ill", "The clinic is closing for repairs", "Mr. Cohen's insurance has expired"], "הרופא צריך להגיע לפגישה דחופה, ולכן מבקשים להזיז את התור לאחד עשרה."),
  q("lx-e2-2", "lx-e2", "What should Mr. Cohen do if the new time is not convenient?", "Call the clinic before five p.m. today", ["Come at nine thirty anyway", "Send an email tomorrow", "Bring his insurance card to the doctor's office"], "אם השעה לא מתאימה, צריך להתקשר עוד היום לפני חמש אחר הצהריים. את כרטיס הביטוח מביאים לתור עצמו."),
  q("lx-e3-1", "lx-e3", "Where does the tour begin?", "In the rose garden", ["In the greenhouse", "At the café", "At the main gate"], "הסיור מתחיל בגן הוורדים, ורק אחר כך עוברים לחממה. הסיור מסתיים בבית הקפה."),
  q("lx-e3-2", "lx-e3", "Why should visitors not use a flash inside the greenhouse?", "It disturbs the plants", ["It is too hot inside", "Photography is not allowed there", "It frightens the birds"], "הדובר אומר שהפלאש מפריע לצמחים. צילום עצמו מותר."),
  q("lx-e4-1", "lx-e4", "Where should members not leave their bags?", "Near the exercise mats", ["Next to the pool", "Near the entrance", "On the machines"], "אסור להשאיר תיקים ליד מזרני התרגול, כי אנשים עלולים להיתקל בהם."),
  q("lx-e4-2", "lx-e4", "Who can swim in the pool only on weekends?", "Children under twelve", ["Adults over sixty", "Members without a trainer", "Anyone who arrives after nine"], "ילדים מתחת לגיל שתים עשרה יכולים לשחות רק בסופי שבוע."),

  // ---- medium ----
  q("lx-m1-1", "lx-m1", "Why does Tom say the new deadline is good news?", "It gives them time to collect more survey answers", ["They have already finished the slides", "The professor needs fewer answers now", "The other group will share its data"], "טום עדיין לא אסף מספיק תשובות לסקר, ולכן דחיית המועד נותנת להם זמן."),
  q("lx-m1-2", "lx-m1", "What has Professor Green required?", "Each group must use its own data", ["Every group must collect at least a hundred answers", "Groups must share their results with each other", "The presentation must be shorter"], "פרופסור גרין קבעה שכל קבוצה משתמשת בנתונים שלה, ולכן אי אפשר לקחת מהקבוצה האחרת. הדרישה היא שמונים תשובות לפחות."),
  q("lx-m1-3", "lx-m1", "What will Maya do tonight?", "Post the survey in the student group chat again", ["Book the practice room", "Ask her brother to share the survey", "Start working on the slides"], "מאיה תפרסם שוב את הסקר בקבוצת הסטודנטים. את האח יבקש טום, את החדר היא תזמין, ועל המצגת יתחילו ביום שני."),
  q("lx-m2-1", "lx-m2", "According to the lecture, what does the length of the waggle show?", "How far away the flowers are", ["Which direction the food is in", "How much nectar there is", "What type of flower it is"], "אורך הרקידה מראה את המרחק: ככל שהדבורה רוקדת זמן רב יותר, הפרחים רחוקים יותר. הזווית היא שמראה את הכיוון."),
  q("lx-m2-2", "lx-m2", "What did the experiments of the 1960s add to what scientists believed?", "The other bees also smell the nectar on the dancer, which helps them recognize the flower", ["Bees do not use the sun to find direction", "Only the dancing bee can find the food", "Bees dance only in bright daylight"], "הניסויים הראו שהדבורים האחרות גם מריחות את הצוף על גוף הרוקדת, וכך מזהות את סוג הפרח."),
  q("lx-m2-3", "lx-m2", "How can bees find the direction on a cloudy day?", "They sense patterns of polarized light in the sky", ["They wait until the sun comes out", "They rely only on the dancer's smell", "They follow the other hives"], "גם כשהשמש מוסתרת, הדבורים קולטות דפוסים של אור מקוטב בשמיים."),
  q("lx-m3-1", "lx-m3", "Why are the shop owners on Harbor Street worried?", "Parking spaces in front of the shops would be lost", ["The streets would become more crowded", "Their rents would go up", "The work would last a full year"], "גברת דהאן תאבד שישה מקומות חניה מול המאפייה, והיא חוששת שלקוחות שמגיעים ברכב ילכו למקום אחר."),
  q("lx-m3-2", "lx-m3", "How does the council respond to the concern?", "It says most customers on that street come on foot or by bus", ["It promises to pay the shop owners", "It offers free parking in another street", "It delays the work until next summer"], "העירייה עונה שסקר מהשנה שעברה הראה שרוב הלקוחות ברחוב מגיעים ברגל או באוטובוס."),
  q("lx-m3-3", "lx-m3", "What can residents do by the tenth of January?", "Register on the city website to take part in the public meeting", ["Vote on the plan online", "Choose which section is built first", "Send a letter to the shop owners"], "מי שרוצה להשתתף באסיפה הציבורית נרשם באתר העירייה עד העשירי בינואר."),
  q("lx-m4-1", "lx-m4", "According to the research, why do teenagers stay up late?", "Their body clock shifts during adolescence", ["They have too much homework", "They are lazy, as many parents think", "They spend too much time on their phones"], "המחקר מצביע על סיבה ביולוגית: בגיל ההתבגרות שעון הגוף זז ובני נוער מתעייפים כשעתיים מאוחר יותר."),
  q("lx-m4-2", "lx-m4", "What happened after the school day began at eight thirty?", "Students slept more, and car accidents involving teenage drivers fell", ["Students' grades rose sharply", "Fewer students came to school", "Sports practice ended earlier"], "אחרי שנתיים התלמידים ישנו כשעה יותר, ותאונות הדרכים של נהגים צעירים פחתו."),
  q("lx-m4-3", "lx-m4", "What concern did some teachers raise?", "Later sports practice made it harder to finish homework", ["Students would fall asleep in class", "Buses would be too crowded", "Teachers would have to work longer hours"], "המורים טענו שאימוני הספורט מסתיימים מאוחר יותר, ולתלמידים קשה יותר לסיים שיעורי בית."),

  // ---- hard ----
  q("lx-h1-1", "lx-h1", "What did the patients in the second group know about their pills?", "That they contained no medicine", ["That they would help within three weeks", "That the first group had received real medicine", "That they were part of a drug trial"], "החוקרים הסבירו בבירור שהכדורים לא מכילים תרופה, ועדיין כמעט פי שניים מהמטופלים דיווחו על שיפור."),
  q("lx-h1-2", "lx-h1", "Why does the speaker mention that the symptoms were measured by self-report?", "To show that the result concerns how patients feel, not a measured physical change", ["To criticize the patients for exaggerating", "To explain why the first group received nothing", "To prove the study was badly designed"], "הדובר מדגיש שהמדידה היא דיווח עצמי, ולכן אי אפשר להסיק על שינוי פיזי בגוף. הוא לא מאשים את המטופלים ולא פוסל את המחקר."),
  q("lx-h1-3", "lx-h1", "How did researchers' view of the placebo effect change?", "From something to be subtracted from results to something worth studying", ["From a proven cure to a myth", "From a harmful effect to a harmless one", "From an effect of drugs to an effect of doctors"], "בעבר ראו בפלצבו הפרעה שצריך להחסיר מתוצאות הניסוי, ובשני העשורים האחרונים התחילו לראות בו תופעה מעניינת בפני עצמה."),
  q("lx-h1-4", "lx-h1", "Why do placebos work best for conditions such as pain or fatigue?", "Such symptoms depend partly on how the brain interprets signals", ["They are easier to cure with sugar", "They are less common than other conditions", "They cannot be measured at all"], "תוצאות של פלצבו מתבטאות בעיקר בתחושות, כי הוא משנה את פירוש האותות במוח. הוא לא מכווץ גידול ולא מוריד כולסטרול."),
  q("lx-h1-5", "lx-h1", "What does the speaker imply about claims that placebos cure serious diseases?", "They probably go beyond what the evidence shows", ["They are true for some digestive diseases", "They need only a few more trials", "They were proven in the study he described"], "הדובר אומר להתייחס לטענות כאלה בחשד, והמסקנה שלו צנועה יותר: הפלצבו משנה את התחושה של המטופל, לא מרפא מחלות קשות."),
  q("lx-h2-1", "lx-h2", "Why is Dana thinking of changing her field?", "She enjoys analyzing data more than running experiments", ["Her grades in biology are low", "A friend advised her to switch", "She cannot work in a laboratory"], "דנה אומרת שמה שהיא הכי נהנית ממנו הוא ניתוח הנתונים, לא הניסויים עצמם. הציונים שלה בביולוגיה טובים."),
  q("lx-h2-2", "lx-h2", "Why does Dr. Brooks say, \"Let me play devil's advocate\"?", "He is raising objections on purpose, to test her decision", ["He disagrees with the whole idea", "He wants her to stay in biology", "He is joking about her grades"], "'לשחק את סנגורו של השטן' פירושו להעלות התנגדויות בכוונה כדי לבדוק את ההחלטה. הוא אומר קודם שזה סימן חזק."),
  q("lx-h2-3", "lx-h2", "What problems does Dr. Brooks see in switching to computer science?", "She would lose credits and has not taken the required math courses", ["She has no programming experience", "The program is almost full", "Her grades are not high enough"], "הוא מזכיר אובדן של כשנה של נקודות זכות, וקורסי מתמטיקה שדנה עוד לא למדה. תכנות היא כבר לומדת לבד."),
  q("lx-h2-4", "lx-h2", "What does Dana's remark about her statistics courses show?", "The switch would cost less time than Dr. Brooks assumed", ["She has already completed the new degree", "She plans to skip the math requirement", "She will take the courses again"], "שני קורסי סטטיסטיקה נספרים בתואר החדש, ולכן האובדן הוא כשני סמסטרים ולא שנה. ד״ר ברוקס מגיב שזה טוב מהצפוי."),
  q("lx-h2-5", "lx-h2", "Why does Dr. Brooks say she should talk to the coordinator soon?", "The application to the bioinformatics program closes on Friday", ["The coordinator is leaving the university", "Her credits expire this week", "The math courses start on Friday"], "מועד ההגשה לתוכנית הביו-אינפורמטיקה הוא יום שישי הקרוב, ולכן כדאי לדבר עם הרכזת לפני שמחליטים."),
  q("lx-h3-1", "lx-h3", "What conclusion was drawn from Hardin's story for decades?", "Shared resources must be privatized or controlled by the state", ["Farmers should limit their herds voluntarily", "Pastures should be shared more widely", "Communities can never own land"], "במשך עשורים השתמשו בסיפור כדי להצדיק הפרטה או שליטה של המדינה במשאבים משותפים."),
  q("lx-h3-2", "lx-h3", "What did Ostrom find in the communities she studied?", "Many protected shared resources with rules the users made themselves", ["Private ownership worked best everywhere", "Government control prevented most disasters", "Shared resources always disappeared in the end"], "אוסטרום מצאה שקהילות רבות שמרו על משאבים במשך מאות שנים בעזרת כללים שהמשתמשים קבעו ואכפו בעצמם."),
  q("lx-h3-3", "lx-h3", "Which feature of the successful rules is mentioned?", "Penalties that start small and grow with repeated violations", ["A heavy fine for a first offense", "Rules written by outside experts", "Membership open to everyone"], "העונשים מתחילים קטנים וגדלים כשמפרים שוב ושוב. הגבולות ברורים, והמושפעים מהכללים יכולים לשנות אותם."),
  q("lx-h3-4", "lx-h3", "What does the speaker conclude about Hardin's story?", "His pasture was unusually unregulated, so it does not show a rule about people", ["Hardin was wrong about human nature", "Hardin ignored the cost of grazing", "Hardin studied the wrong country"], "הדובר אומר במפורש שהלקח אינו שהרדין טעה לגבי טבע האדם, אלא שהמרעה שלו היה חסר כללים באופן חריג. כשאנשים מדברים, האמון גדל והכללים עובדים."),
  q("lx-h4-1", "lx-h4", "What is Omar's main concern about launching on schedule?", "Bad reviews from users with older phones", ["Higher advertising costs", "The developers leaving the team", "Crashes on newer phones"], "עומר חושש מדירוגי כוכב אחד של משתמשים עם טלפונים ישנים, ש\"נשארים לנצח\". בטלפונים חדשים האפליקציה כמעט מושלמת."),
  q("lx-h4-2", "lx-h4", "Why does Lena say, \"That's what worries me\"?", "The developers gave the same estimate last time and were wrong", ["Two weeks is too expensive", "The developers refuse to give a date", "The marketing team needs more time"], "המפתחים אמרו גם בפעם הקודמת שבועיים, וזה לקח חמישה. לכן ההערכה הנוכחית לא מרגיעה אותה."),
  q("lx-h4-3", "lx-h4", "What does Lena propose?", "To launch on time for newer phones and add older ones later", ["To delay the launch by five weeks", "To remove the app from older phones", "To cancel the advertisements"], "לנה מציעה להשיק בזמן רק לטלפונים חדשים, ולהוסיף את הישנים כשהתיקון יהיה מוכן."),
  q("lx-h4-4", "lx-h4", "What risk does Omar see in her plan?", "People may think the missing support is a bug rather than a decision", ["Newer phones might crash too", "The advertisements would be wasted", "The developers would stop working"], "עומר אומר שצריך להסביר את זה היטב, אחרת משתמשים יחשבו שמדובר בתקלה ולא בהחלטה."),
  q("lx-h4-5", "lx-h4", "What does Omar mean by \"a date, not a hope\"?", "The developers should commit to a specific deadline", ["He hopes the launch will be moved", "He wants to cancel the launch", "The marketing team needs a date"], "עומר רוצה שהמפתחים יתחייבו למועד מוגדר, ולא יסתפקו בתקווה שהתיקון יהיה מוכן."),
];
