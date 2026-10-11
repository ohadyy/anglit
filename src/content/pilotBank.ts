// Experimental (pilot) chapters of Amirnet, written for Anglit. Original content.
// The formats follow NITE's published descriptions:
// - Lecture or conversation (listening): three clips of about 30, 60 and 90 seconds,
//   one speaker per clip, with 1, 2 and 2 questions. 7 minutes per chapter.
// - Listening text continuation (audiocomplete): four clips of about 20 seconds. Each
//   clip ends before its last sentence is complete, and the student picks the words that
//   continue it. The options are not read aloud. 4 minutes per chapter.
// - Word formation (wordformation): one base word in bold, a blank in the sentence, and
//   the student types the new word. Spelling matters. 3 minutes per chapter.
// Grammar in context lives in grammarBank.ts.
// status: "approved". The teacher approved the question bank before these were written.

import type { ListeningQuestion, Passage, WordFormationQuestion } from "./questions";

type Options = ListeningQuestion["options"];

const IMAGE = "/brand/listening-illustration.png";

function clip(id: string, title: string): Passage {
  return { id, title, paragraphs: [], audio: `/audio/pilot/${id}.mp3`, image: IMAGE };
}

function lecture(
  id: string,
  passageId: string,
  stem: string,
  options: Options,
  answer: 0 | 1 | 2 | 3,
  explanation: string,
): ListeningQuestion {
  return { id, type: "listening", passageId, stem, options, answer, explanation, status: "approved" };
}

function continuation(
  id: string,
  passageId: string,
  options: Options,
  answer: 0 | 1 | 2 | 3,
  explanation: string,
): ListeningQuestion {
  return {
    id,
    type: "audiocomplete",
    passageId,
    stem: "Choose the words which continue the recording most appropriately.",
    options,
    answer,
    explanation,
    status: "approved",
  };
}

// ---------- Lecture or conversation: 6 sets of three clips (short, medium, long) ----------

const lectureClips: Passage[] = [
  clip("lec1-a", "קטע קצר: הודעה לסטודנטים"),
  clip("lec1-b", "קטע בינוני: הודעה קולית על טיסה"),
  clip("lec1-c", "קטע ארוך: הרצאה על חזזיות"),
  clip("lec2-a", "קטע קצר: הודעה על שביל סגור"),
  clip("lec2-b", "קטע בינוני: סיור עם אוצרת מוזיאון"),
  clip("lec2-c", "קטע ארוך: הרצאה על מגדלורים"),
  clip("lec3-a", "קטע קצר: הודעה ממרכז ללימוד אנגלית"),
  clip("lec3-b", "קטע בינוני: הודעה קולית משותפת לפרויקט"),
  clip("lec3-c", "קטע ארוך: הרצאה על טורבינות רוח"),
  clip("lec4-a", "קטע קצר: הודעה משומר טבע"),
  clip("lec4-b", "קטע בינוני: פודקאסט על תה"),
  clip("lec4-c", "קטע ארוך: הרצאה על צמחי מדבר"),
  clip("lec5-a", "קטע קצר: הודעה על איסוף מיחזור"),
  clip("lec5-b", "קטע בינוני: הודעה קולית ממנהלת משמרות"),
  clip("lec5-c", "קטע ארוך: הרצאה על שפת סימנים"),
  clip("lec6-a", "קטע קצר: הודעה מבית מרקחת"),
  clip("lec6-b", "קטע בינוני: הרצאה על היסטוריה של זכוכית"),
  clip("lec6-c", "קטע ארוך: הרצאה על שוניות אלמוגים"),
];

// Each set: one question on the short clip, two on the medium, two on the long
export const lectureSets: ListeningQuestion[][] = [
  [
    lecture("lec1-1", "lec1-a", "What should students do on Thursday?", ["Walk to the north gate", "Take the number 9 bus", "Wait at the information desk", "Ride the shuttle in the evening"], 1, "במקום מעבורת 4 מומלץ לקחת את אוטובוס 9, שעוצר באותה פינה."),
    lecture("lec1-2", "lec1-b", "Why is Dan calling?", ["To cancel the hotel booking", "To tell Noa that her flight time has changed", "To ask Noa to pay for a new ticket", "To confirm Noa's seat on the morning flight"], 1, "הדובר מודיע שמועד הטיסה השתנה מבוקר לערב."),
    lecture("lec1-3", "lec1-b", "What must Noa do if the new time does not suit her?", ["Pay an extra fee", "Call the hotel directly", "Choose another flight by Friday at noon", "Wait at the airport on the day"], 2, "אפשר לבחור טיסה אחרת בלי תשלום נוסף, אבל צריך להודיע עד יום שישי בצהריים."),
    lecture("lec1-4", "lec1-c", "What is the main point of the lecture?", ["Lichens are a type of moss that grows only in forests", "Lichens can show how polluted the air has been over time", "Lichens are the main food for birds in cities", "Lichens grow faster in polluted areas"], 1, "חזזיות משמשות סמן לזיהום אוויר לאורך שנים. הן לא מזון לציפורים, ובזיהום הן גדלות לאט יותר."),
    lecture("lec1-5", "lec1-c", "What does the lecturer say about the fungus part of a lichen?", ["It makes food from sunlight", "It provides structure and holds water", "It is harmed by sunlight", "It produces sulfur dioxide"], 1, "הפטרייה מספקת מבנה ומחזיקה מים. האצה היא זו שמייצרת מזון מאור השמש."),
  ],
  [
    lecture("lec2-1", "lec2-a", "Why is the lower section of the Hill Path closed?", ["Because of construction work", "Because of a landslide after the rain", "Because the picnic area is full", "Because of a bear sighting"], 1, "אחרי הגשם הקרקע התמוטטה, ולכן המסלול התחתון סגור עד הודעה חדשה."),
    lecture("lec2-2", "lec2-b", "Why did the conservation team spend eighteen months on the painting?", ["To paint a new sky", "To remove a dull yellow varnish and restore the colors", "To move the painting to another museum", "To replace the frame"], 1, "לכה צהובה עמעמה את הצבעים, והצוות שחזר אותם בזהירות."),
    lecture("lec2-3", "lec2-b", "What did the team decide about the old repairs?", ["Remove all of them", "Keep them, as part of the painting's history", "Paint over them in blue", "Move them to the back of the canvas"], 1, "התיקונים הישנים נשמרו, כי הם חלק מההיסטוריה של הציור."),
    lecture("lec2-4", "lec2-c", "What did lighthouses use before oil lamps?", ["Electric lights", "Open fires", "Fresnel lenses", "Reflectors made of glass"], 1, "לפני מנורות השמן השתמשו בשריפה גלויה של עץ או פחם."),
    lecture("lec2-5", "lec2-c", "What was the main advantage of the Fresnel lens?", ["It was cheap to produce", "It made a small lamp's light visible from far away", "It did not need any glass", "It could burn wood"], 1, "עדשת פרנל אספה את האור לקרן אחת חזקה, שנראתה מרחוק."),
  ],
  [
    lecture("lec3-1", "lec3-a", "What has changed about the workshop?", ["The time has moved to the morning", "The day and the room have changed", "The workshop has been cancelled", "Students must pay a fee"], 1, "המפגש עבר ליום רביעי ולחדר 204. השעה נשארה שש בערב."),
    lecture("lec3-2", "lec3-b", "Why did Yael miss the meeting?", ["She had a dentist appointment", "She was sick at home", "She forgot the time", "She was working on the survey"], 0, "היא הייתה אצל רופא שיניים, והטלפון שלה היה כבוי."),
    lecture("lec3-3", "lec3-b", "What is the problem with the survey?", ["It is too long for students to answer", "It has fewer answers than needed", "The link does not work", "The professor did not approve it"], 1, "הסקר צריך לפחות שישים תשובות, ויש עד עכשיו עשרים ושתיים."),
    lecture("lec3-4", "lec3-c", "What causes most of the sound from a turbine?", ["The tower itself", "The blades moving through the air", "The motor under the ground", "The wires that carry electricity"], 1, "הרעש העיקרי נוצר מהלהבים כשהן חותכות את האוויר."),
    lecture("lec3-5", "lec3-c", "Why do planners leave a large gap between turbines and houses?", ["Because the land is cheaper there", "To reduce the noise that reaches homes", "Because the turbines need more space to turn", "Because the wind is stronger near houses"], 1, "המרחק מפחית את הרעש שמגיע לבתים."),
  ],
  [
    lecture("lec4-1", "lec4-a", "Why should visitors keep dogs on leashes in the picnic area?", ["The grass is wet", "Ground birds are nesting there", "The park has a new fence", "Dogs are not allowed to swim"], 1, "הציפורים קינו באזור הזה באביב, ולכן צריך לשמור על הביצים."),
    lecture("lec4-2", "lec4-b", "How was tea first used, according to the host?", ["As medicine", "As a currency", "As a sweet dessert", "As a cooking oil"], 0, "תה שימש קודם כתרופה, ורק אחר כך הפך למשקה יומיומי."),
    lecture("lec4-3", "lec4-b", "Why did adding milk and sugar show wealth in England?", ["Milk and sugar were free", "Both products were expensive", "Only rich people drank water", "Tea was banned for poor people"], 1, "חלב וסוכר היו יקרים, ולכן להוסיף אותם לתה הראה על מעמד."),
    lecture("lec4-4", "lec4-c", "When do many desert plants open their pores?", ["Only during the hottest hours", "At night, when the air is cooler", "Only after heavy rain", "Continuously, without pause"], 1, "צמחי מדבר רבים פותחים את הנקביות בלילה, כשהאוויר פחות יבש."),
    lecture("lec4-5", "lec4-c", "Why are scientists interested in desert plants?", ["Because they grow very tall", "Because their methods could help crops that need less water", "Because they produce large amounts of oil", "Because they can live in the sea"], 1, "השיטות שלהם יכולות לעזור לגדל יבולים עם פחות מים."),
  ],
  [
    lecture("lec5-1", "lec5-a", "Where will the bulk recycling collection take place next Sunday?", ["On Main Street", "On Harbor Street", "In the city park", "At the waste plant"], 1, "האיסוף עובר לרחוב הנמל במקום הרחוב הראשי."),
    lecture("lec5-2", "lec5-b", "Why does Karen need a shift swap?", ["Ron is sick", "Tamar is sick and the Saturday shift is short-staffed", "The shop is closing on Saturday", "Eli asked to take a day off"], 1, "תמר חולה, ובבוקר של שבת יש רק שני עובדים."),
    lecture("lec5-3", "lec5-b", "What must Ron do?", ["Send the final list to head office", "Call Karen back before noon", "Update the staff board himself", "Bring the cash box to the shop"], 1, "רון צריך להתקשר לקרן לפני הצהריים."),
    lecture("lec5-4", "lec5-c", "What common misunderstanding does the lecturer describe?", ["That sign language is universal", "That sign language is spoken language translated into hand movements", "That sign languages are unrelated to English", "That only children learn sign language"], 1, "שפת סימנים היא שפה מלאה עם דקדוק משלה, ולא תרגום של דיבור."),
    lecture("lec5-5", "lec5-c", "What did brain scans show?", ["Signing uses a completely different brain system", "The same language regions are active for signing and speaking", "Signing has no effect on the brain", "The brain only processes spoken words"], 1, "סריקות מוח מראות שאזורי השפה פעילים גם בסימנים וגם בדיבור."),
  ],
  [
    lecture("lec6-1", "lec6-a", "Why should Mr. Gil come before six on Thursday?", ["The pharmacy closes early that day", "The medicine expires at six", "The delivery is only in the morning", "A doctor will visit the pharmacy"], 0, "ביום חמישי בית המרקחת נסגר מוקדם."),
    lecture("lec6-2", "lec6-b", "When did glassblowing develop, according to the lecturer?", ["Around the first century, in the Roman world", "Before the glass beads in Egypt", "In the sixteenth century in England", "In the twentieth century"], 0, "נפיחת זכוכית התפתחה בעולם הרומי סביב המאה הראשונה."),
    lecture("lec6-3", "lec6-b", "What made glassblowing an important change?", ["It made glass stronger than metal", "It allowed glass to be shaped quickly and cheaply", "It removed the need for fire", "It made glass only for royalty"], 1, "עם נפיחה אפשר היה לעצב זכוכית מהר וזול."),
    lecture("lec6-4", "lec6-c", "What does bleaching mean in the lecture?", ["Coral loses its colorful algae because of warm water", "Coral grows a thicker skeleton", "Fish move away from the reef at night", "The reef becomes deeper"], 0, "בליצה היא מצב שבו האלמוג מאבד את האצות הצבעוניות שלו בגלל מים חמים."),
    lecture("lec6-5", "lec6-c", "What do many resorts do to protect reefs?", ["Ban all visitors from the water", "Use mooring buoys instead of anchors", "Remove the coral and replant it elsewhere", "Build fences around the beach"], 1, "במקום עוגנים, רבים משתמשים בתושבות עגינה."),
  ],
];

// ---------- Listening text continuation: 4 sets of four clips (about 20 seconds each) ----------

const continuationClips: Passage[] = [
  clip("ac1-1", "Listen to part of a lecture on suspension bridges."),
  clip("ac1-2", "Listen to part of a lecture on ocean tides."),
  clip("ac1-3", "Listen to part of a lecture on papyrus."),
  clip("ac1-4", "Listen to part of a lecture on smell and memory."),
  clip("ac2-1", "Listen to part of a lecture on glaciers."),
  clip("ac2-2", "Listen to part of a lecture on chess strategy."),
  clip("ac2-3", "Listen to part of a lecture on antibodies."),
  clip("ac2-4", "Listen to part of a lecture on archaeology."),
  clip("ac3-1", "Listen to part of a lecture on silence in music."),
  clip("ac3-2", "Listen to part of a lecture on wolves in Yellowstone."),
  clip("ac3-3", "Listen to part of a lecture on inflation."),
  clip("ac3-4", "Listen to part of a lecture on bird vision."),
  clip("ac4-1", "Listen to part of a lecture on earthquakes."),
  clip("ac4-2", "Listen to part of a lecture on Roman concrete."),
  clip("ac4-3", "Listen to part of a lecture on memory and lists."),
  clip("ac4-4", "Listen to part of a lecture on the Hubble telescope."),
];

export const audioCompletionSets: ListeningQuestion[][] = [
  [
    continuation("ac1-1-q", "ac1-1", ["collapsed into the river below", "was painted a new color", "became a popular tourist site", "needed fewer cables"], 0, "הגשר התמוטט לנהר, ולכן המשפט נשלם בצורה הזו."),
    continuation("ac1-2-q", "ac1-2", ["the moon stops pulling the ocean", "they are called spring tides", "the sea level falls permanently", "the coastline stays dry"], 1, "כשהשמש והירח מתיישרים, הגאות חזקות יותר: אלה גאות האביב."),
    continuation("ac1-3-q", "ac1-3", ["used only for religious paintings", "replaced by stone tablets", "exported across the Mediterranean", "made from cotton and wool"], 2, "פפירוס יוצא למדינות אגן הים התיכון, כך שהמשפט מתחבר לכך."),
    continuation("ac1-4-q", "ac1-4", ["they fade much faster", "they never involve childhood", "they depend on hearing", "they are often more vivid"], 3, "הזיכרונות שמעוררים ריח נוטים להיות חיים יותר מזיכרונות מתמונה."),
  ],
  [
    continuation("ac2-1-q", "ac2-1", ["they are carried back uphill by the ice", "they can block rivers and form new lakes", "they turn into sandy beaches overnight", "they disappear as soon as the sun rises"], 1, "סלעי המורנה יכולים לחסום נהרות וליצור אגמים חדשים."),
    continuation("ac2-2-q", "ac2-2", ["finish the game in the first ten moves", "avoid contact with the other pieces", "create a weakness in the opponent's position", "sacrifice all the pawns at once"], 2, "תוכנית טובה בשחמט נועדה ליצור חולשה אצל היריב."),
    continuation("ac2-3-q", "ac2-3", ["slower and weaker", "faster and stronger", "the same as before", "delayed by several weeks"], 1, "חיסון מכין את הגוף לתגובה מהירה וחזקה יותר."),
    continuation("ac2-4-q", "ac2-4", ["where it was sold", "how much it weighs today", "when it was buried, and by whom", "whether it is made of gold"], 2, "השכבה שבה נמצא החפץ מספרת מתי הוא נקבר, ומי נקב אותו."),
  ],
  [
    continuation("ac3-1-q", "ac3-1", ["tempo speed up suddenly", "orchestra leave the stage", "piano lose its tuning", "anticipation build before the theme returns"], 3, "ההפסקה בונה ציפייה לפני שהנושא חוזר."),
    continuation("ac3-2-q", "ac3-2", ["wolves are bad for the river", "small changes can spread through an entire ecosystem", "elk should be removed from parks", "trees grow faster without animals"], 1, "שינוי קטן בהתנהגות של בעל חיים יכול להשפיע על כל המערכת האקולוגית."),
    continuation("ac3-3-q", "ac3-3", ["grows automatically", "is guaranteed by the bank", "shrinks over time", "doubles every five years"], 2, "כשהמחירים עולים מהר משכר, ערך החסכונות יורד בהדרגה."),
    continuation("ac3-4-q", "ac3-4", ["the ones humans find most pleasing", "the ones that stand out in ultraviolet", "always dull and grey", "found only at night"], 1, "הציפורים מעדיפות את הצבעים שבולטים באולטרה-סגול."),
  ],
  [
    continuation("ac4-1-q", "ac4-1", ["disappearing", "released slowly", "moving toward the sea", "building up"], 3, "לחץ נבנה לאורך זמן בשבר שלא זז, ולכן הוא מסוכן."),
    continuation("ac4-2-q", "ac4-2", ["lighter and easier to break", "stronger over time", "transparent in sunlight", "unable to resist salt"], 1, "הבטון הרומי הפך חזק יותר עם הזמן, בזכות המינרלים החדשים שנוצרו בו."),
    continuation("ac4-3-q", "ac4-3", ["in the middle, where no one looks", "after the audience has left", "at the start or the end", "in a footnote"], 2, "הפריטים בתחילת הרשימה ובסופה נזכרים הכי טוב, ולכן כדאי לשים שם את הנקודה החשובה."),
    continuation("ac4-4-q", "ac4-4", ["rivers on Earth are", "clouds above the sea are", "trees in the forest are", "galaxies really are"], 3, "טלסקופ האבל מודד את המרחקים של גלקסיות רחוקות."),
  ],
];

// ---------- Word formation: 10 sets of four items, typed answers ----------

function wordFormation(
  id: string,
  stem: string,
  baseWord: string,
  accepted: string[],
  explanation: string,
): WordFormationQuestion {
  return { id, type: "wordformation", stem, baseWord, accepted, explanation, status: "approved" };
}

export const wordFormationSets: WordFormationQuestion[][] = [
  [
    wordFormation("wf1-1", "The manager's ____ to close the branch surprised the whole team.", "decide", ["decision"], "השם decision נוצר מהפועל decide, ומתאים כנושא של המשפט."),
    wordFormation("wf1-2", "The new software is very ____, and it can process thousands of files in seconds.", "efficiency", ["efficient"], "התואר efficient נוצר מהשם efficiency."),
    wordFormation("wf1-3", "She was ____ to finish the course on time, so she studied every evening.", "determine", ["determined"], "הצורה determined היא תואר מהפועל determine."),
    wordFormation("wf1-4", "The ____ of the bridge took three years and cost millions.", "construct", ["construction"], "השם construction נוצר מהפועל construct."),
  ],
  [
    wordFormation("wf2-1", "Our team ____ the results of the experiment last week.", "analyze", ["analyzed", "analysed"], "נדרשת צורת העבר של analyze. גם האיות הבריטי מתקבל."),
    wordFormation("wf2-2", "The ____ of the new policy was not clear to most employees.", "explain", ["explanation"], "השם explanation נוצר מהפועל explain."),
    wordFormation("wf2-3", "Please keep the documents in a ____ place, away from water.", "safety", ["safe"], "התואר safe נוצר מהשם safety."),
    wordFormation("wf2-4", "The ____ of the city grew quickly after the new railway opened.", "populate", ["population"], "השם population נוצר מהפועל populate."),
  ],
  [
    wordFormation("wf3-1", "The children were ____ by the magician's tricks.", "amaze", ["amazed"], "הצורה amazed היא תואר מהפועל amaze, בתפקיד תיאור של הילדים."),
    wordFormation("wf3-2", "The food is very ____, and it provides plenty of vitamins.", "nutrition", ["nutritious"], "התואר nutritious נוצר מהשם nutrition."),
    wordFormation("wf3-3", "The delay was ____, because of the storm.", "avoid", ["unavoidable"], "התחילית un- והסיומת able נוספו לבסיס avoid."),
    wordFormation("wf3-4", "He spoke very ____, so nobody could hear him.", "quiet", ["quietly"], "תואר הפועל quietly נוצר מהתואר quiet."),
  ],
  [
    wordFormation("wf4-1", "The painting is extremely ____.", "value", ["valuable"], "התואר valuable נוצר מהשם value."),
    wordFormation("wf4-2", "Students must act ____ when they use the lab equipment.", "responsible", ["responsibly"], "תואר הפועל responsibly נוצר מהתואר responsible."),
    wordFormation("wf4-3", "The ____ of the train was delayed by fog.", "arrive", ["arrival"], "השם arrival נוצר מהפועל arrive."),
    wordFormation("wf4-4", "The new fence offers ____ against wild animals.", "protect", ["protection"], "השם protection נוצר מהפועל protect."),
  ],
  [
    wordFormation("wf5-1", "Mark's ____ on the exam was excellent, and he was proud of it.", "perform", ["performance"], "השם performance נוצר מהפועל perform."),
    wordFormation("wf5-2", "The ____ of the lake is about forty meters.", "deep", ["depth"], "השם depth נוצר מהתואר deep."),
    wordFormation("wf5-3", "The school offers a ____ of activities after classes.", "vary", ["variety"], "השם variety נוצר מהפועל vary."),
    wordFormation("wf5-4", "She was ____ with her grade, but she worked harder next time.", "disappoint", ["disappointed"], "הצורה disappointed היא תואר מהפועל disappoint."),
  ],
  [
    wordFormation("wf6-1", "The ____ of the company into Europe was planned for years.", "expand", ["expansion"], "השם expansion נוצר מהפועל expand."),
    wordFormation("wf6-2", "The doctor gave a clear ____ of the treatment.", "describe", ["description"], "השם description נוצר מהפועל describe."),
    wordFormation("wf6-3", "It was a very ____ movie, and I cried at the end.", "emotion", ["emotional"], "התואר emotional נוצר מהשם emotion."),
    wordFormation("wf6-4", "The committee has ____ our proposal.", "accept", ["accepted"], "הצורה accepted היא צורת עבר מושלם של accept."),
  ],
  [
    wordFormation("wf7-1", "The town is famous for its beautiful ____, which cover the hills.", "garden", ["gardens"], "הצורה gardens היא רבים של garden."),
    wordFormation("wf7-2", "The engineer ____ the bridge's design before construction began.", "review", ["reviewed"], "הצורה reviewed היא צורת עבר של review."),
    wordFormation("wf7-3", "We were ____ by the warm welcome from the local families.", "surprise", ["surprised"], "הצורה surprised היא תואר מהפועל surprise."),
    wordFormation("wf7-4", "The ____ of the tree roots damaged the sidewalk.", "grow", ["growth"], "השם growth נוצר מהפועל grow."),
  ],
  [
    wordFormation("wf8-1", "The athlete's ____ improved after months of training.", "strong", ["strength"], "השם strength נוצר מהתואר strong."),
    wordFormation("wf8-2", "The ____ of the novel left the readers guessing.", "end", ["ending"], "השם ending נוצר מהפועל end."),
    wordFormation("wf8-3", "Her ____ to the charity helped build a new school.", "contribute", ["contribution"], "השם contribution נוצר מהפועל contribute."),
    wordFormation("wf8-4", "Only a small lamp broke the ____ of the room.", "dark", ["darkness"], "השם darkness נוצר מהתואר dark."),
  ],
  [
    wordFormation("wf9-1", "They discussed the issue ____ in the office.", "private", ["privately"], "תואר הפועל privately נוצר מהתואר private."),
    wordFormation("wf9-2", "The ____ of the road is only three meters.", "wide", ["width"], "השם width נוצר מהתואר wide."),
    wordFormation("wf9-3", "He ____ his mistake and apologized to the class.", "admit", ["admitted"], "הצורה admitted היא צורת עבר של admit."),
    wordFormation("wf9-4", "The team ____ the report over the weekend.", "prepare", ["prepared"], "הצורה prepared היא צורת עבר של prepare."),
  ],
  [
    wordFormation("wf10-1", "The ____ of the film took eighteen months.", "produce", ["production"], "השם production נוצר מהפועל produce."),
    wordFormation("wf10-2", "The ____ of the mountain made the climb very hard.", "steep", ["steepness"], "השם steepness נוצר מהתואר steep."),
    wordFormation("wf10-3", "Our neighbors are very ____, and they always help us.", "help", ["helpful"], "התואר helpful נוצר מהפועל help."),
    wordFormation("wf10-4", "The bike was ____ to the fence, so it was safe.", "lock", ["locked"], "הצורה locked היא צורת עבר של lock."),
  ],
];

export const pilotPassages: Passage[] = [...lectureClips, ...continuationClips];
