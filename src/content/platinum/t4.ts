import { build } from "./build";

// Platinum IV · Vanguard
export const vanguard = build(4, {
  sentence: [
    [
      "The prime minister's ____ optimism, in the face of mounting evidence of recession, struck many economists as dangerously detached from reality.",
      "unrealistic",
      ["cautious","reasonable","gloomy"],
      "אופטימיות מנותקת מהמציאות היא לא ריאלית. unrealistic = לא מציאותי.",
    ],
    [
      "The scientist, fearing that her results might be ____ by those with a political agenda, insisted on releasing the raw data alongside her conclusions.",
      "distorted",
      ["improved","confirmed","delayed"],
      "פרסום הנתונים הגולמיים נועד למנוע עיוות. distorted = עוות, סולף.",
    ],
    [
      "The diplomat's warm, ____ manner concealed a ruthlessly calculating mind.",
      "charming",
      ["hostile","distant","stubborn"],
      "warm מרמז על התנהגות נעימה, והמשפט מתאר ניגוד לתוכנו הקר. charming = מקסים.",
    ],
    [
      "The report is full of ____ claims, none of which is supported by anything resembling evidence.",
      "unproven",
      ["verified","modest","obvious"],
      "טענות בלי שום ראיה: unproven = לא מוכח.",
    ],
    [
      "Even as shareholders threatened to withdraw their support, the board remained ____ in its decision.",
      "firm",
      ["flexible","uncertain","apologetic"],
      "למרות האיום הדירקטוריון לא נכנע. firm = איתן, נחוש.",
    ],
    [
      "The play's ending, which offers neither resolution nor consolation, has proved ____ among critics, some calling it brilliant and others unforgivably bleak.",
      "controversial",
      ["forgettable","universal","predictable"],
      "חלק מהמבקרים מלהיבים וחלק מוקיעים: controversial = שנוי במחלוקת.",
    ],
    [
      "To the casual observer, the two species are virtually ____, but a trained biologist can distinguish them at a glance.",
      "identical",
      ["extinct","dangerous","unrelated"],
      "ביולוג מומחה מבחין מיד, אבל למתבונן מזדמן אין הבדל. identical = זהה.",
    ],
    [
      "His ____ manner, which some mistook for arrogance, was in fact the shyness of a man ill at ease among strangers.",
      "distant",
      ["cheerful","talkative","generous"],
      "ביישנות שנראית כגאווה: distant = מרוחק, מסויג.",
    ],
    [
      "The excavation yielded an ____ of artifacts so vast that cataloguing them took the team more than a decade.",
      "abundance",
      ["shortage","handful","lack"],
      "כמות עצומה שלקח עשור לרשום: abundance = שפע.",
    ],
    [
      "Because the contract was drafted in haste, it contained several ____ clauses that later gave rise to costly disputes.",
      "unclear",
      ["strict","profitable","traditional"],
      "ניסוח בחיפזון יוצר סעיפים לא ברורים שמובילים לסכסוכים. unclear = לא ברור.",
    ],
    [
      "Though he claimed to be indifferent to fame, his careful cultivation of the press suggested a more ____ attitude.",
      "calculating",
      ["sincere","relaxed","modest"],
      "Though מציג ניגוד: טוען שאדיש, אבל מטפח את העיתונות. calculating = מחושב, אינטרסנטי.",
    ],
    [
      "The architect's design was so ____ that it appeared to defy the laws of physics, though in fact its stability had been verified repeatedly.",
      "daring",
      ["ordinary","cheap","tiresome"],
      "נראה כמתריס נגד חוקי הפיזיקה: daring = נועז.",
    ],
  ],
  restatement: [
    [
      "Were it not for the timely intervention of the coast guard, the fishermen would have drowned.",
      "The coast guard's timely intervention saved the fishermen from drowning.",
      [
        "The coast guard intervened too late to save the fishermen.",
        "The fishermen drowned because the coast guard did not intervene.",
        "The fishermen were saved even though the coast guard did not intervene.",
      ],
      "Were it not for = אלמלא. אלמלא התערבות המשמר הם היו טובעים, כלומר ההתערבות הצילה אותם.",
    ],
    [
      "Rarely does a policy so thoroughly satisfy both its supporters and its opponents.",
      "It is unusual for a policy to satisfy both its supporters and its opponents so completely.",
      [
        "A policy often satisfies both its supporters and its opponents completely.",
        "Opponents of the policy are rarely satisfied by its supporters.",
        "The policy has satisfied its supporters but never its opponents.",
      ],
      "Rarely does... = נדיר ש־. נדיר שמדיניות משביעה רצון גם את התומכים וגם את המתנגדים.",
    ],
    [
      "She is far less interested in winning the argument than in understanding her opponent.",
      "Understanding her opponent matters to her more than winning the argument.",
      [
        "Winning the argument matters to her more than understanding her opponent.",
        "She understands her opponent far less than she wants to win the argument.",
        "She is equally interested in winning the argument and in understanding her opponent.",
      ],
      "far less A than B = B חשוב לה הרבה יותר מ־A. ההבנה חשובה לה יותר מהניצחון.",
    ],
    [
      "The theory could not have been proposed without the data gathered by earlier expeditions.",
      "The theory depended on data collected by earlier expeditions.",
      [
        "Earlier expeditions proposed the theory without gathering data.",
        "The theory was proposed although data from earlier expeditions was unavailable.",
        "Data from earlier expeditions made the theory unnecessary.",
      ],
      "could not have been... without = בלי X זה לא היה קורה, כלומר התלוי ב־X.",
    ],
    [
      "Try as he might, the engineer could not persuade the committee to reconsider.",
      "Despite his best efforts, the engineer failed to persuade the committee to reconsider.",
      [
        "The engineer persuaded the committee to reconsider after trying hard.",
        "The engineer might have persuaded the committee if he had tried.",
        "The committee reconsidered because the engineer tried hard.",
      ],
      "Try as he might = לא משנה כמה ניסה. למרות מאמציו, הוא לא הצליח.",
    ],
    [
      "Were the plan to succeed, it would have to win the support of at least two of the three major parties.",
      "The plan can succeed only if at least two of the three major parties support it.",
      [
        "The plan has already won the support of two of the three major parties.",
        "The plan would succeed even without the support of the major parties.",
        "The plan needs the support of all three major parties in order to succeed.",
      ],
      "Were the plan to succeed = אם הוא יצליח. would have to = חייב. לפחות שתיים משלוש, ולא כולן.",
    ],
  ],
  passage: {
    title: "The Tyranny of the Clock",
    paragraphs: [
      "Before the nineteenth century, time was a local affair. Each town set its clocks by the sun, so that noon in one city arrived several minutes before it did in a neighbor a few dozen miles to the west. This arrangement caused no difficulty so long as travel was slow; a traveler on horseback could hardly notice a discrepancy of minutes between one village and the next.",
      "The railways changed everything. A timetable that listed arrivals according to a dozen different local times was worse than useless, and accidents resulting from confusion gave the problem an urgent human cost. In Britain, the railway companies began adopting a single standard in the 1840s, and public clocks gradually followed suit. In North America, where distances were larger and the patchwork of local times more bewildering, the railroads introduced four continental time zones in 1883, acting well before any government compelled them to do so.",
      "Not everyone welcomed the change. Some communities resisted on the ground that the sun, not a company, should govern the day; a few newspapers denounced standard time as an affront to nature. Yet the objections were rarely sustained, for the benefits of coordination were too visible to ignore. Standard time became, in effect, an infrastructure as indispensable as the rails themselves, one that made possible not only reliable travel but also the synchronized factory shifts and telegraphed business that defined an industrial economy.",
      "The historian's irony is that a convention introduced to serve a particular industry has long since come to seem natural. Few people today think of the clock on the wall as a human invention; it is simply what time \"is.\" That, one might argue, is the surest sign of a successful standard: its origins have been forgotten.",
    ],
  },
  reading: [
    [
      "Which of the following best summarizes the passage?",
      "Standard time arose from the practical demands of the railways and has since come to seem natural.",
      [
        "Local times were more accurate than the standard time that replaced them.",
        "Governments created standard time in order to control the working day.",
        "Opposition to standard time prevented its adoption in North America.",
      ],
      "הטקסט מתאר מעבר מזמן מקומי לזמן אחיד בגלל הרכבות, ומסיים בכך שהמצאה אנושית הפכה למובנת מאליה. הממשלות לא יזמו את השינוי באמריקה.",
    ],
    [
      "The author implies that, in North America, the railroads adopted time zones",
      "on their own initiative, before any law required it.",
      [
        "only after a government order forced them to.",
        "in response to widespread public demand for sun-based time.",
        "to protest government regulation of timetables.",
      ],
      "המשפט אומר שהרכבות פעלו well before any government compelled them to do so, כלומר ביוזמתן ולפני כל חוק.",
      2,
    ],
    [
      "In paragraph 3, the word \"affront\" is closest in meaning to",
      "an offense against something respected.",
      [
        "an improvement upon something existing.",
        "a threat to economic growth.",
        "a correction of an earlier mistake.",
      ],
      "affront = עלבון, פגיעה בכבוד. העיתונים טענו שהזמן האחיד פוגע בטבע.",
      3,
    ],
    [
      "Why does the author mention the newspapers that denounced standard time?",
      "To show that the change met with resistance that did not last.",
      [
        "To prove that standard time was imposed by law.",
        "To demonstrate that newspapers influenced the railways' decisions.",
        "To argue that the objections to standard time were justified.",
      ],
      "הדוגמה באה לתאר התנגדות, והמשפט הבא אומר שהטענות לא החזיקו מעמד (rarely sustained) מפני שהיתרונות היו ברורים.",
      3,
    ],
    [
      "The final sentence suggests that the author regards the forgotten origins of standard time as",
      "evidence of how completely the standard has been accepted.",
      [
        "a regrettable failure of historical education.",
        "a sign that the standard is likely to be replaced.",
        "proof that the railways deliberately concealed their role.",
      ],
      "surest sign of a successful standard = הסימן הבטוח ביותר להצלחה. כשאיש לא זוכר שהזמן הומצא, זה מעיד על קבלה מלאה.",
      4,
    ],
  ],
});
