import { grammarQuestions } from "./grammarBank";
import { audioCompletionSets, lectureSets, pilotPassages, wordFormationSets } from "./pilotBank";
import { extraPassages, extraQuestions } from "./extraBank";
// Original question bank. Every question here was written for Anglit —
// nothing is copied from NITE or from other prep sites.
// status: "approved" until reviewed by the teacher, then "approved".

export type QuestionType =
  | "sentence"
  | "restatement"
  | "reading"
  | "listening"
  | "grammar"
  | "audiocomplete"
  | "wordformation";

type Options = [string, string, string, string];

type BaseQuestion = {
  id: string;
  stem: string;
  options: Options;
  answer: 0 | 1 | 2 | 3;
  /** Hebrew explanation shown after answering */
  explanation: string;
  /** The one-line exam trick, in the teacher's voice */
  trick?: string;
  /** Words in the stem to highlight after answering */
  keywords?: string[];
  status: "approved" | "approved";
};

export type SentenceQuestion = BaseQuestion & { type: "sentence" };
export type RestatementQuestion = BaseQuestion & { type: "restatement" };
export type ReadingQuestion = BaseQuestion & {
  type: "reading";
  passageId: string;
  /** 1-based paragraph the question refers to; omitted = whole passage */
  paragraph?: number;
};

export type ListeningQuestion = BaseQuestion & {
  type: "listening" | "audiocomplete";
  /** Which audio clip this question is about */
  passageId: string;
};
export type GrammarQuestion = BaseQuestion & { type: "grammar" };

/** Typed answer: the student writes one word, which must match one of `accepted` (lowercase) */
export type WordFormationQuestion = {
  id: string;
  type: "wordformation";
  stem: string;
  baseWord: string;
  accepted: string[];
  explanation: string;
  trick?: string;
  status: "approved";
};

/** Anything an exam can ask: the multiple-choice types plus typed word formation */
export type ExamQuestion = Question | WordFormationQuestion;

export type Question =
  | SentenceQuestion
  | RestatementQuestion
  | ReadingQuestion
  | ListeningQuestion
  | GrammarQuestion;

export type Passage = { id: string; title: string; paragraphs: string[]; audio?: string; image?: string };

export { TYPE_LABELS } from "./questionLabels";

export const passages: Passage[] = [
  {
    id: "heat",
    title: "Cities Under the Canopy",
    paragraphs: [
      "Cities are often several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. Asphalt roads, concrete buildings and dark rooftops absorb sunlight during the day and slowly release that heat at night. As a result, residents of large cities may experience high temperatures long after the sun has set, which can be dangerous for elderly people and those with health problems.",
      "One of the simplest ways to cool a city is to plant more trees. Trees provide shade, which prevents sunlight from reaching the ground and heating it. They also release water vapor through their leaves, a process that cools the surrounding air in much the same way that sweat cools the human body. Studies have shown that streets lined with mature trees can be several degrees cooler than similar streets without them.",
      "However, planting trees is not a perfect solution. Young trees need years to grow large enough to provide significant shade, and they require regular watering, which can be costly in dry regions. In addition, trees planted too close to buildings may damage foundations with their roots. For these reasons, some city planners argue that tree planting should be combined with other measures, such as light-colored roofs that reflect rather than absorb sunlight.",
    ],
  },
  {
    id: "multitask",
    title: "The Myth of Multitasking",
    paragraphs: [
      "Many people take pride in their ability to multitask: answering emails during a meeting, or texting while listening to a lecture. Yet research in cognitive psychology suggests that what we call multitasking is, in most cases, something else entirely. Rather than performing two tasks at once, the brain rapidly switches its attention from one task to the other.",
      "This switching comes at a cost. Each time we shift our focus, the brain needs a moment to adjust to the new task, and some information is lost in the process. Researchers refer to this as a \"switch cost.\" Although each individual switch may take only a fraction of a second, the delays add up. In one well-known type of experiment, participants who alternated between two simple tasks took considerably longer and made more errors than those who completed one task before starting the other.",
      "Interestingly, people who multitask most frequently are not necessarily better at it. Some studies have found that heavy multitaskers are actually more easily distracted by irrelevant information. The researchers suggest that habitual multitasking may train the brain to respond to every new stimulus, making deep concentration more difficult.",
      "None of this means that doing two things at once is always impossible. Walking while talking, for example, poses little difficulty, because walking requires almost no conscious attention. The problem arises when both tasks demand active thought.",
    ],
  },
  ...pilotPassages,
  ...extraPassages,
];

export const questions: Question[] = [
  // ─── Sentence Completion ───────────────────────────────────────────
  {
    id: "sc-01",
    type: "sentence",
    stem: "Despite the team's ____ efforts, the project was completed three months behind schedule.",
    options: ["diligent", "reluctant", "careless", "brief"],
    answer: 0,
    keywords: ["Despite"],
    explanation:
      "Despite = למרות. יש ניגוד: המאמצים היו טובים, ובכל זאת הפרויקט איחר. לכן צריך מילה חיובית — diligent (חרוץ, מתמיד).",
    trick: "מילת ניגוד בתחילת המשפט? חפשו תשובה שהופכת את הכיוון של החלק השני.",
    status: "approved",
  },
  {
    id: "sc-02",
    type: "sentence",
    stem: "The new law was designed to ____ pollution by limiting the amount of waste factories may release into rivers.",
    options: ["curb", "provoke", "disguise", "sustain"],
    answer: 0,
    keywords: ["limiting"],
    explanation:
      "החוק מגביל (limiting) פסולת — המטרה היא לצמצם זיהום. curb = לרסן, לבלום.",
    trick: "החלק שאחרי by מסביר איך — הוא מגלה לכם את המשמעות של המילה החסרה.",
    status: "approved",
  },
  {
    id: "sc-03",
    type: "sentence",
    stem: "Because the evidence was ____, the judge had no choice but to dismiss the case.",
    options: ["overwhelming", "insufficient", "accurate", "consistent"],
    answer: 1,
    keywords: ["Because", "dismiss"],
    explanation:
      "השופט דחה את התיק — כלומר לא היו מספיק ראיות. insufficient = לא מספיק.",
    trick: "Because = סיבה ותוצאה. תתחילו מהתוצאה (dismiss) ותשאלו מה גרם לה.",
    status: "approved",
  },
  {
    id: "sc-04",
    type: "sentence",
    stem: "Many ancient cities were built near rivers, which provided a ____ supply of water for drinking and farming.",
    options: ["scarce", "reliable", "hostile", "temporary"],
    answer: 1,
    explanation:
      "בנו ערים ליד נהרות כי הם סיפקו מים באופן קבוע. reliable = אמין, שאפשר לסמוך עליו. scarce (נדיר) הוא ההפך.",
    status: "approved",
  },
  {
    id: "sc-05",
    type: "sentence",
    stem: "The scientist's theory was initially ____ by her colleagues, but it later gained wide acceptance.",
    options: ["dismissed", "adopted", "praised", "funded"],
    answer: 0,
    keywords: ["initially", "but", "later"],
    explanation:
      "initially ... but later — בהתחלה X, אבל אחר כך ההפך. בסוף קיבלו את התיאוריה, אז בהתחלה דחו אותה. dismissed = נדחה, בוטל.",
    trick: "initially / at first + but = שני חלקים הפוכים. תמיד.",
    status: "approved",
  },
  {
    id: "sc-06",
    type: "sentence",
    stem: "Sleep deprivation can ____ a person's ability to concentrate, making even simple tasks difficult.",
    options: ["enhance", "impair", "reveal", "measure"],
    answer: 1,
    keywords: ["difficult"],
    explanation:
      "חוסר שינה הופך משימות פשוטות לקשות — כלומר הוא פוגע בריכוז. impair = לפגוע, להחליש. enhance = לשפר (ההפך).",
    status: "approved",
  },
  {
    id: "sc-07",
    type: "sentence",
    stem: "The museum's collection is so ____ that visitors could spend weeks there without seeing everything.",
    options: ["vast", "fragile", "modest", "obscure"],
    answer: 0,
    keywords: ["so", "that"],
    explanation:
      "so ... that = כל כך ... ש. אפשר לבלות שבועות בלי לראות הכול — האוסף עצום. vast = עצום, נרחב.",
    trick: "so ___ that — החלק שאחרי that הוא התוצאה. היא מגדירה בדיוק את המילה החסרה.",
    status: "approved",
  },
  {
    id: "sc-08",
    type: "sentence",
    stem: "Unlike his outgoing brother, Daniel is rather ____ and prefers to spend his evenings alone.",
    options: ["sociable", "reserved", "generous", "ambitious"],
    answer: 1,
    keywords: ["Unlike", "alone"],
    explanation:
      "Unlike = בניגוד ל. האח חברותי (outgoing), ודניאל מעדיף להיות לבד — מופנם. reserved = שמור, מופנם.",
    status: "approved",
  },
  {
    id: "sc-09",
    type: "sentence",
    stem: "The company decided to ____ the product after several customers reported that it overheated.",
    options: ["promote", "recall", "upgrade", "export"],
    answer: 1,
    explanation:
      "המוצר התחמם יתר על המידה — החברה אוספת אותו חזרה מהשוק. recall = להחזיר מוצר, ריקול.",
    status: "approved",
  },
  {
    id: "sc-10",
    type: "sentence",
    stem: "Although the two species look almost ____, they are not closely related.",
    options: ["identical", "dangerous", "unfamiliar", "extinct"],
    answer: 0,
    keywords: ["Although"],
    explanation:
      "Although = למרות ש. הם לא קרובים — למרות שהם נראים כמעט זהים. identical = זהה.",
    status: "approved",
  },
  {
    id: "sc-11",
    type: "sentence",
    stem: "The drought had a ____ effect on the region's economy, which depends heavily on agriculture.",
    options: ["negligible", "devastating", "beneficial", "predictable"],
    answer: 1,
    keywords: ["depends heavily"],
    explanation:
      "כלכלה שתלויה בחקלאות + בצורת = נזק גדול. devastating = הרסני. negligible = זניח (ההפך).",
    status: "approved",
  },
  {
    id: "sc-12",
    type: "sentence",
    stem: "In order to ____ the spread of the disease, health officials urged residents to stay home.",
    options: ["accelerate", "contain", "document", "justify"],
    answer: 1,
    explanation:
      "מבקשים מאנשים להישאר בבית כדי לעצור את ההתפשטות. contain = לבלום, להכיל. accelerate = להאיץ (ההפך).",
    status: "approved",
  },
  {
    id: "sc-13",
    type: "sentence",
    stem: "The instructions were so ____ that nobody understood what they were supposed to do.",
    options: ["vague", "precise", "thorough", "formal"],
    answer: 0,
    keywords: ["so", "that", "nobody understood"],
    explanation:
      "אף אחד לא הבין — ההוראות היו לא ברורות. vague = מעורפל. precise ו-thorough הם ההפך.",
    status: "approved",
  },
  {
    id: "sc-14",
    type: "sentence",
    stem: "The ancient manuscript is extremely ____, so researchers must wear gloves when handling it.",
    options: ["durable", "fragile", "legible", "popular"],
    answer: 1,
    keywords: ["gloves"],
    explanation:
      "לובשים כפפות כדי לא לפגוע בכתב היד — הוא עדין ושביר. fragile = שביר. durable = עמיד (ההפך).",
    status: "approved",
  },
  {
    id: "sc-15",
    type: "sentence",
    stem: "The mayor's speech was intended to ____ the public, who had grown anxious after the earthquake.",
    options: ["reassure", "mislead", "provoke", "entertain"],
    answer: 0,
    keywords: ["anxious"],
    explanation:
      "הציבור היה לחוץ אחרי רעידת האדמה — הנאום נועד להרגיע. reassure = להרגיע, לחזק את הביטחון.",
    status: "approved",
  },
  {
    id: "sc-16",
    type: "sentence",
    stem: "Researchers found a strong ____ between regular exercise and improved mood.",
    options: ["correlation", "contradiction", "distinction", "obstacle"],
    answer: 0,
    keywords: ["between"],
    explanation:
      "a strong ___ between X and Y — קשר בין שני דברים. correlation = מתאם, קשר.",
    status: "approved",
  },

  // ─── Restatements ─────────────────────────────────────────────────
  {
    id: "rs-01",
    type: "restatement",
    stem: "Hardly anyone expected the small startup to outperform its well-established competitors.",
    options: [
      "Most people believed the startup would do better than its competitors.",
      "Few people thought the startup would do better than the older companies.",
      "The startup's competitors expected it to fail because it was small.",
      "The well-established companies performed better than anyone expected.",
    ],
    answer: 1,
    keywords: ["Hardly anyone"],
    explanation:
      "Hardly anyone = כמעט אף אחד. כמעט אף אחד לא ציפה שהסטארטאפ יצליח יותר = מעט אנשים חשבו כך. תשובה 1 הפוכה, 3 ו-4 מוסיפות מידע שלא כתוב.",
    trick: "hardly / scarcely / barely = כמעט לא. מילה אחת קטנה שהופכת את כל המשפט.",
    status: "approved",
  },
  {
    id: "rs-02",
    type: "restatement",
    stem: "Had the bridge been inspected regularly, the accident might have been prevented.",
    options: [
      "The accident happened even though the bridge was inspected regularly.",
      "Regular inspections of the bridge caused the accident.",
      "The accident may not have occurred if the bridge had been checked regularly.",
      "After the accident, the bridge was inspected regularly.",
    ],
    answer: 2,
    keywords: ["Had"],
    explanation:
      "Had the bridge been... = If the bridge had been... — משפט תנאי הפוך. המשמעות: לא בדקו את הגשר, ולכן קרתה התאונה. אם היו בודקים, אולי היו מונעים אותה.",
    trick: "משפט שמתחיל ב-Had / Were / Should בלי if — זה משפט תנאי. תקראו אותו עם if.",
    status: "approved",
  },
  {
    id: "rs-03",
    type: "restatement",
    stem: "The novel's popularity stems not from its plot, but from its vivid characters.",
    options: [
      "The novel is popular mainly because of its characters rather than its story.",
      "Both the plot and the characters make the novel popular.",
      "The novel's plot is more vivid than its characters.",
      "Readers dislike the novel's characters but enjoy its plot.",
    ],
    answer: 0,
    keywords: ["stems", "not from", "but from"],
    explanation:
      "stems from = נובע מ. not from X but from Y — לא מהעלילה אלא מהדמויות. רק תשובה 1 שומרת על הסדר הזה.",
    trick: "not X but Y — בדקו שהתשובה לא מחליפה בין X ל-Y. זה המלכוד הכי נפוץ.",
    status: "approved",
  },
  {
    id: "rs-04",
    type: "restatement",
    stem: "No sooner had the concert begun than the power went out.",
    options: [
      "The power went out before the concert began.",
      "The power went out immediately after the concert started.",
      "The concert began as soon as the power came back.",
      "The concert was cancelled because of a power outage.",
    ],
    answer: 1,
    keywords: ["No sooner", "than"],
    explanation:
      "No sooner ... than = ברגע ש..., מיד. ההופעה בדיוק התחילה והחשמל נפל. תשובה 4 מוסיפה ביטול — זה לא כתוב.",
    trick: "No sooner ... than = מיד אחרי. אל תתבלבלו מ-than — זו לא השוואה.",
    status: "approved",
  },
  {
    id: "rs-05",
    type: "restatement",
    stem: "The committee's decision was far from unanimous.",
    options: [
      "Not all committee members agreed with the decision.",
      "The committee reached its decision far too late.",
      "Every member of the committee supported the decision.",
      "The committee's decision was made far away.",
    ],
    answer: 0,
    keywords: ["far from"],
    explanation:
      "far from = רחוק מ, בכלל לא. unanimous = פה אחד. ההחלטה בכלל לא התקבלה פה אחד = לא כולם הסכימו.",
    trick: "far from = שלילה חזקה. far from easy = קשה מאוד.",
    status: "approved",
  },
  {
    id: "rs-06",
    type: "restatement",
    stem: "Contrary to popular belief, bats are not blind; many species can see quite well.",
    options: [
      "Most people know that bats can see well.",
      "Although many people think bats are blind, many species actually have good vision.",
      "Bats are blind, but they use their other senses well.",
      "Only a few species of bats are able to see.",
    ],
    answer: 1,
    keywords: ["Contrary to popular belief"],
    explanation:
      "Contrary to popular belief = בניגוד לדעה הרווחת. רוב האנשים חושבים שעטלפים עיוורים — אבל זה לא נכון.",
    status: "approved",
  },
  {
    id: "rs-07",
    type: "restatement",
    stem: "The medication is effective only if it is taken on an empty stomach.",
    options: [
      "Taking the medication with food makes it more effective.",
      "The medication works regardless of when it is taken.",
      "For the medication to work, a person must not have eaten beforehand.",
      "The medication causes stomach problems if taken too often.",
    ],
    answer: 2,
    keywords: ["only if"],
    explanation:
      "only if = רק אם. התרופה עובדת רק על קיבה ריקה = כדי שתעבוד, אסור לאכול לפני.",
    status: "approved",
  },
  {
    id: "rs-08",
    type: "restatement",
    stem: "The more you practice, the less anxious you are likely to feel during the exam.",
    options: [
      "Practicing a lot usually reduces exam anxiety.",
      "People who feel anxious tend to practice more.",
      "Practicing too much can increase anxiety.",
      "Anxiety during an exam is unrelated to practice.",
    ],
    answer: 0,
    keywords: ["The more", "the less"],
    explanation:
      "The more X, the less Y = ככל ש-X עולה, Y יורד. יותר תרגול = פחות לחץ. תשובה 2 הופכת את הסיבה והתוצאה.",
    trick: "the more ... the ... — בדקו מי הסיבה ומי התוצאה. מסיחים אוהבים להחליף ביניהן.",
    status: "approved",
  },
  {
    id: "rs-09",
    type: "restatement",
    stem: "It was not until the 19th century that scientists understood how diseases spread.",
    options: [
      "Scientists stopped studying diseases in the 19th century.",
      "Before the 19th century, scientists did not understand how diseases spread.",
      "In the 19th century, diseases spread faster than ever.",
      "Scientists have understood disease transmission for many centuries.",
    ],
    answer: 1,
    keywords: ["not until"],
    explanation:
      "It was not until X that Y = רק ב-X קרה Y. כלומר, לפני המאה ה-19 לא הבינו.",
    trick: "not until = רק כש / רק ב. קל להתבלבל ולחשוב שזו שלילה.",
    status: "approved",
  },
  {
    id: "rs-10",
    type: "restatement",
    stem: "Although the plan seemed promising on paper, it proved impractical once put into action.",
    options: [
      "The plan worked better in practice than expected.",
      "The plan looked good in theory but did not work in reality.",
      "The plan was never actually tested.",
      "The plan was rejected because it was written poorly.",
    ],
    answer: 1,
    keywords: ["on paper", "impractical"],
    explanation:
      "on paper = בתיאוריה. impractical = לא מעשי. על הנייר נראה טוב, במציאות לא עבד.",
    status: "approved",
  },
  {
    id: "rs-11",
    type: "restatement",
    stem: "Few inventions have had as profound an impact on daily life as the smartphone.",
    options: [
      "The smartphone has changed daily life more than almost any other invention.",
      "Many inventions have influenced daily life more than the smartphone.",
      "The smartphone has had little impact on daily life.",
      "Few people use smartphones in their daily lives.",
    ],
    answer: 0,
    keywords: ["Few", "as profound", "as"],
    explanation:
      "למעט המצאות הייתה השפעה עמוקה כמו לסמארטפון = הסמארטפון השפיע יותר כמעט מכל המצאה אחרת. profound = עמוק.",
    trick: "Few ... as ... as X = X הוא מהבודדים בראש הרשימה.",
    status: "approved",
  },
  {
    id: "rs-12",
    type: "restatement",
    stem: "The author insists that her book is a work of fiction, despite its striking resemblance to real events.",
    options: [
      "The author admits that her book describes real events.",
      "Although the book closely resembles real events, the author maintains that it is fiction.",
      "The book is fiction and does not resemble any real events.",
      "Readers insist the book is fiction, but the author disagrees.",
    ],
    answer: 1,
    keywords: ["insists", "despite", "resemblance"],
    explanation:
      "insists = מתעקשת. despite = למרות. striking resemblance = דמיון בולט. הספר דומה מאוד לאירועים אמיתיים, והסופרת מתעקשת שזו בדיה.",
    status: "approved",
  },

  // ─── Reading Comprehension ────────────────────────────────────────
  {
    id: "rc-heat-1",
    type: "reading",
    passageId: "heat",
    stem: "The main purpose of the text is to:",
    options: [
      "explain why cities are warmer than rural areas and discuss one way to address the problem",
      "argue that cities should stop using asphalt",
      "describe the health problems of elderly city residents",
      "compare different types of trees",
    ],
    answer: 0,
    explanation:
      "פסקה 1: למה ערים חמות. פסקאות 2–3: עצים כפתרון, כולל החסרונות. תשובה 1 מכסה את כל הטקסט; השאר מתמקדות בפרט אחד.",
    trick: "שאלת מטרה? התשובה צריכה לכסות את כל הפסקאות, לא רק אחת.",
    status: "approved",
  },
  {
    id: "rc-heat-2",
    type: "reading",
    passageId: "heat",
    paragraph: 1,
    stem: "According to paragraph 1, why do cities stay hot at night?",
    options: [
      "Because more people are outside at night",
      "Because materials that absorbed heat during the day release it slowly",
      "Because there are not enough trees in cities",
      "Because cities receive more sunlight than rural areas",
    ],
    answer: 1,
    keywords: ["slowly release that heat at night"],
    explanation:
      "כתוב במפורש: אספלט ובטון סופגים חום ביום ומשחררים אותו לאט בלילה. תשובה 3 נכונה בעולם, אבל לא מופיעה בפסקה 1.",
    trick: "According to = מה כתוב בטקסט, לא מה שנכון בעולם.",
    status: "approved",
  },
  {
    id: "rc-heat-3",
    type: "reading",
    passageId: "heat",
    paragraph: 2,
    stem: "In paragraph 2, the comparison to sweat is used to:",
    options: [
      "show that trees need a lot of water",
      "explain how water released by trees cools the air",
      "suggest that people should exercise under trees",
      "demonstrate that trees are similar to humans",
    ],
    answer: 1,
    keywords: ["in much the same way that sweat cools the human body"],
    explanation:
      "ההשוואה לזיעה מסבירה את התהליך: כמו שזיעה מקררת את הגוף, אדי המים מהעלים מקררים את האוויר.",
    status: "approved",
  },
  {
    id: "rc-heat-4",
    type: "reading",
    passageId: "heat",
    paragraph: 3,
    stem: "Which of the following is NOT mentioned in paragraph 3 as a drawback of planting trees?",
    options: [
      "Trees take a long time to grow",
      "Trees may damage buildings",
      "Watering trees can be expensive",
      "Trees attract insects",
    ],
    answer: 3,
    explanation:
      "שלושת הראשונים מופיעים בפסקה. חרקים לא מוזכרים בכלל.",
    trick: "שאלת NOT — סמנו כל תשובה שכן מופיעה. מה שנשאר הוא התשובה.",
    status: "approved",
  },
  {
    id: "rc-heat-5",
    type: "reading",
    passageId: "heat",
    paragraph: 3,
    stem: "It can be inferred that light-colored roofs help cool cities because they:",
    options: [
      "absorb less sunlight",
      "are cheaper than trees",
      "grow stronger over time",
      "provide shade to the streets",
    ],
    answer: 0,
    keywords: ["reflect rather than absorb sunlight"],
    explanation:
      "גגות בהירים מחזירים אור במקום לספוג אותו — כלומר סופגים פחות חום.",
    status: "approved",
  },
  {
    id: "rc-mt-1",
    type: "reading",
    passageId: "multitask",
    paragraph: 1,
    stem: "According to paragraph 1, what actually happens when people \"multitask\"?",
    options: [
      "The brain performs both tasks at exactly the same time.",
      "The brain quickly moves its attention back and forth between tasks.",
      "The brain ignores one of the tasks completely.",
      "The brain slows down in order to handle both tasks.",
    ],
    answer: 1,
    keywords: ["rapidly switches its attention"],
    explanation:
      "the brain rapidly switches its attention — המוח קופץ מהר בין המשימות, ולא עושה את שתיהן בו-זמנית.",
    status: "approved",
  },
  {
    id: "rc-mt-2",
    type: "reading",
    passageId: "multitask",
    paragraph: 2,
    stem: "The term \"switch cost\" (paragraph 2) refers to:",
    options: [
      "the price of the technology used for multitasking",
      "the loss of time and accuracy when changing focus between tasks",
      "the effort needed to begin work in the morning",
      "the number of tasks a person can perform",
    ],
    answer: 1,
    explanation:
      "הפסקה מסבירה: בכל מעבר המוח צריך רגע להסתגל, מידע הולך לאיבוד, והעיכובים מצטברים. cost כאן הוא לא כסף.",
    trick: "מונח במירכאות? ההגדרה שלו כמעט תמיד כתובה במשפט שלפניו או אחריו.",
    status: "approved",
  },
  {
    id: "rc-mt-3",
    type: "reading",
    passageId: "multitask",
    paragraph: 3,
    stem: "What does paragraph 3 suggest about frequent multitaskers?",
    options: [
      "They are more skilled at ignoring distractions.",
      "They may find it harder to concentrate deeply.",
      "They complete tasks faster than others.",
      "They prefer simple tasks.",
    ],
    answer: 1,
    keywords: ["making deep concentration more difficult"],
    explanation:
      "כתוב שמי שעושה הרבה מולטיטאסקינג מוסח יותר, ושזה עלול להקשות על ריכוז עמוק. תשובה 1 הפוכה.",
    status: "approved",
  },
  {
    id: "rc-mt-4",
    type: "reading",
    passageId: "multitask",
    paragraph: 4,
    stem: "Why does the author mention walking while talking in paragraph 4?",
    options: [
      "To give an example of two tasks that can be combined because one requires little attention",
      "To prove that multitasking is always possible",
      "To show that walking improves concentration",
      "To contradict the research described in paragraph 2",
    ],
    answer: 0,
    keywords: ["requires almost no conscious attention"],
    explanation:
      "הליכה כמעט לא דורשת קשב, ולכן אפשר לשלב אותה עם דיבור. זו דוגמה למקרה החריג.",
    trick: "Why does the author mention X? — חפשו את ה-because שאחרי הדוגמה.",
    status: "approved",
  },
  {
    id: "rc-mt-5",
    type: "reading",
    passageId: "multitask",
    stem: "The author's attitude toward multitasking can best be described as:",
    options: ["enthusiastic", "critical but balanced", "completely neutral", "confused"],
    answer: 1,
    explanation:
      "רוב הטקסט מבקר מולטיטאסקינג (עלות, הסחות), אבל פסקה 4 מאזנת: לפעמים זה כן אפשרי. ביקורתי אבל מאוזן.",
    trick: "שאלת עמדה: שימו לב לפסקה האחרונה — שם הכותב לרוב מסייג או מסכם.",
    status: "approved",
  },
  {
    id: "gr-01",
    type: "grammar",
    stem: "If we ___ earlier, we would have caught the train.",
    options: ["left","had left","leave","have left"],
    answer: 1,
    explanation: "משפט תנאי מסוג שלישי מתאר מצב שלא התקיים בעבר: if + had + חלק עבר, would have + חלק עבר. כאן: had left.",
    trick: "כשיש would have בתוצאה, בתנאי יופיע had + חלק עבר.",
    status: "approved",
  },
  {
    id: "gr-02",
    type: "grammar",
    stem: "Neither the manager nor the employees ___ aware of the change.",
    options: ["was","were","is","has been"],
    answer: 1,
    explanation: "במבנה neither...nor הפועל מתאים לנושא הקרוב אליו. כאן employees ברבים, ולכן were.",
    status: "approved",
  },
  {
    id: "gr-03",
    type: "grammar",
    stem: "The report, along with the charts, ___ on the desk.",
    options: ["are","were","is","have been"],
    answer: 2,
    explanation: "הנושא הראשי הוא report, שהוא יחיד. הביטוי along with שאחריו לא משנה את ההסכמה, ולכן is.",
    trick: "הביטוי along with לא הופך את הנושא לרבים.",
    status: "approved",
  },
  {
    id: "gr-04",
    type: "grammar",
    stem: "She suggested that he ___ the meeting.",
    options: ["attends","attended","to attend","attend"],
    answer: 3,
    explanation: "אחרי הפעלים suggest, recommend ו-insist משתמשים בצורת הבסיס בלי s: attend.",
    trick: "אחרי suggest, בתוך that, הפועל תמיד בצורת הבסיס.",
    status: "approved",
  },
  ...grammarQuestions,
  ...lectureSets.flat(),
  ...audioCompletionSets.flat(),
  ...extraQuestions,
];

export function getPassage(id: string) {
  return passages.find((p) => p.id === id)!;
}

export function questionsByType(type?: QuestionType) {
  return type ? questions.filter((q) => q.type === type) : questions;
}

/** Word formation items, used only in the exam's pilot chapters */
export const wordFormationQuestions: WordFormationQuestion[] = wordFormationSets.flat();

/** Whether the answer is right. Multiple choice compares the option index. Word formation
 * compares the typed word with the accepted spellings, ignoring case and surrounding spaces. */
export function isCorrectAnswer(q: ExamQuestion, value: number | string | null | undefined): boolean {
  if (q.type === "wordformation") {
    return typeof value === "string" && q.accepted.includes(value.trim().toLowerCase());
  }
  return value === q.answer;
}
