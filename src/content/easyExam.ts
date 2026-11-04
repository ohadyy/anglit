import { build } from "./platinum/build";

// Admin-only warm-up test for a learner with basic English. Same six core chapters as the
// regular tests, but each chapter starts easy and ends at the level of the regular tests
// (sentences 1-4 basic, 5-8 intermediate, 9-12 regular; restatements 1-3 simple, 4-6 regular).
// Reuses the Platinum authoring format; the "90" only keeps the question ids apart from pl1-pl5.
export const easyBank = build(90, {
  sentence: [
    [
      "Maya was very ____ after running for an hour, so she sat down to rest.",
      "tired",
      ["cold", "funny", "early"],
      "רצה שעה ולכן התיישבה לנוח: tired = עייפה.",
    ],
    [
      "The shop was closed, so we had to ____ until the next morning.",
      "wait",
      ["sing", "wash", "borrow"],
      "החנות סגורה, אז צריך להמתין עד הבוקר. wait = לחכות.",
    ],
    [
      "The test was very ____, and almost every student got a high grade.",
      "easy",
      ["loud", "dangerous", "expensive"],
      "כמעט כולם קיבלו ציון גבוה, כלומר המבחן היה קל. easy = קל.",
    ],
    [
      "He didn't have enough money, so he could not ____ the new phone.",
      "buy",
      ["forget", "describe", "visit"],
      "אין מספיק כסף, ולכן אי אפשר לקנות. buy = לקנות.",
    ],
    [
      "Because the road was ____ with snow, drivers had to move very slowly.",
      "covered",
      ["proud", "absent", "curious"],
      "שלג על הכביש מאט את הנהגים. covered with = מכוסה ב־.",
    ],
    [
      "Although the restaurant looked ____ from the outside, the food inside was excellent.",
      "plain",
      ["delicious", "famous", "crowded"],
      "Although מציג ניגוד: מבחוץ לא מרשים, אבל האוכל מצוין. plain = פשוט, לא מרשים.",
    ],
    [
      "The teacher asked the students to ____ their ideas clearly before writing the essay.",
      "organize",
      ["ignore", "borrow", "delay"],
      "לפני כתיבת חיבור מסדרים את הרעיונות. organize = לארגן, לסדר.",
    ],
    [
      "Sara was ____ about the interview, so she practiced her answers many times.",
      "nervous",
      ["careless", "generous", "bored"],
      "מי שמתאמן שוב ושוב מתכונן כי הוא לחוץ. nervous = לחוץ, מתוח.",
    ],
    [
      "The company's profits ____ sharply last year, forcing it to close several branches.",
      "dropped",
      ["expanded", "multiplied", "stabilized"],
      "סגירת סניפים היא תוצאה של ירידה ברווחים. dropped = ירדו.",
    ],
    [
      "Despite the heavy rain, the organizers refused to ____ the event, insisting it would go ahead as planned.",
      "cancel",
      ["extend", "advertise", "reward"],
      "Despite = למרות. הם התעקשו שהאירוע ייערך כמתוכנן, כלומר סירבו לבטל. cancel = לבטל.",
    ],
    [
      "The scientist's explanation was so ____ that even beginners could follow every step.",
      "clear",
      ["confusing", "technical", "hesitant"],
      "even beginners = אפילו מתחילים הצליחו לעקוב, ולכן ההסבר היה ברור. clear = ברור.",
    ],
    [
      "Rather than ____ his mistake, the engineer admitted it immediately and offered a solution.",
      "deny",
      ["repeat", "admire", "measure"],
      "Rather than = במקום. במקום להכחיש, הוא הודה. deny = להכחיש.",
    ],
  ],
  restatement: [
    [
      "Dan is taller than his brother.",
      "His brother is shorter than Dan.",
      ["Dan is shorter than his brother.", "Dan and his brother are the same height.", "Dan's brother is taller than he is."],
      "taller than = גבוה מ־. אם דן גבוה יותר, אחיו נמוך יותר.",
    ],
    [
      "I will call you when I arrive at the station.",
      "I will phone you after I get to the station.",
      [
        "I called you after I arrived at the station.",
        "I will call you before I leave the station.",
        "You will call me when you arrive at the station.",
      ],
      "call = phone, arrive at = get to. אותו עתיד ואותו סדר: קודם מגיע, אחר כך מתקשר.",
    ],
    [
      "Unless you hurry, you will miss the bus.",
      "If you do not hurry, you will miss the bus.",
      [
        "If you hurry, you will miss the bus.",
        "You will miss the bus because you hurried.",
        "You hurried, so you did not miss the bus.",
      ],
      "Unless = אם לא. Unless you hurry = If you do not hurry.",
    ],
    [
      "The film was so long that many people left before the end.",
      "Many people left early because the film was very long.",
      [
        "The film ended before many people left.",
        "The film was too short for many people.",
        "Many people left because the film had a sad ending.",
      ],
      "so ... that = כל כך ... ש־. הסרט ארוך, ולכן אנשים עזבו לפני הסוף.",
    ],
    [
      "Not only did she finish the report, but she also corrected the errors in it.",
      "She finished the report and also fixed its mistakes.",
      [
        "She corrected the errors but did not finish the report.",
        "She finished the report, but it still contained errors.",
        "She was asked to correct the errors, so she did not finish the report.",
      ],
      "Not only... but also = לא רק... אלא גם. שני הדברים קרו: סיימה ותיקנה.",
    ],
    [
      "Hardly had the meeting started when the power went out.",
      "The power went out almost as soon as the meeting began.",
      [
        "The meeting started after the power went out.",
        "The meeting continued for hours before the power went out.",
        "The power went out because the meeting started.",
      ],
      "Hardly had... when = בקושי התחיל... וכבר. החשמל נפל מיד עם תחילת הפגישה.",
    ],
  ],
  passage: {
    title: "Sleeping Cool",
    paragraphs: [
      "Many people believe that a warm bedroom helps them sleep. In fact, scientists have found that the opposite is often true. During the night, the body's temperature falls slightly, and this drop helps us fall asleep and stay asleep.",
      "If a bedroom is too warm, the body has difficulty cooling down. As a result, people wake up more often and spend less time in deep sleep. Most sleep experts suggest a temperature of around 18 degrees Celsius, although the best temperature differs slightly from person to person.",
      "There are simple ways to keep a room cool at night. Opening a window, using a light blanket and wearing light clothes can all help. However, a room that is too cold can also be a problem, because shivering makes it hard to relax. The goal is not to freeze, but to feel comfortably cool.",
    ],
  },
  reading: [
    [
      "According to the passage, what happens to body temperature during the night?",
      "It falls slightly.",
      ["It rises sharply.", "It stays exactly the same.", "It changes only in the morning."],
      "בפסקה הראשונה: the body's temperature falls slightly.",
      1,
    ],
    [
      "What is the effect of a bedroom that is too warm?",
      "People wake up more often and get less deep sleep.",
      ["People fall asleep faster.", "People sleep longer than usual.", "People dream more."],
      "בפסקה השנייה: As a result, people wake up more often and spend less time in deep sleep.",
      2,
    ],
    [
      "What do sleep experts say about the best bedroom temperature?",
      "About 18 degrees is suggested, but it varies a little from person to person.",
      [
        "It is exactly the same for everyone.",
        "It should be as low as possible.",
        "There is no advice because experts disagree.",
      ],
      "המומחים מציעים כ-18 מעלות, אבל ההבדל בין אנשים קיים: differs slightly from person to person.",
      2,
    ],
    [
      "Why does the author mention shivering?",
      "To show that a room can also be too cold.",
      [
        "To explain why people use heavy blankets.",
        "To prove that warm rooms are better for sleep.",
        "To describe a common illness.",
      ],
      "However מסמן ניגוד: גם חדר קר מדי הוא בעיה, כי רעד מקשה להירגע.",
      3,
    ],
    [
      "Which statement would the author most likely agree with?",
      "The best bedroom feels cool but not uncomfortably cold.",
      [
        "The colder the room is, the better people sleep.",
        "Bedroom temperature has almost no effect on sleep.",
        "Everyone should sleep at exactly 18 degrees.",
      ],
      "המסקנה בסוף: The goal is not to freeze, but to feel comfortably cool.",
    ],
  ],
});
