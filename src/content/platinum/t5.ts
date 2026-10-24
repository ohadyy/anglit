import { build } from "./build";

// Platinum V · Zenith
export const zenith = build(5, {
  sentence: [
    [
      "The scholar's reputation rested on a single, ____ study, whose influence far exceeded its modest length.",
      "groundbreaking",
      ["minor","outdated","repetitive"],
      "מחקר קצר עם השפעה עצומה: groundbreaking = פורץ דרך.",
    ],
    [
      "The mayor's ____ promises, made with no intention of fulfilling them, did little to reassure a skeptical public.",
      "insincere",
      ["honest","specific","generous"],
      "הבטחות בלי כוונה לקיים: insincere = לא כנות.",
    ],
    [
      "Years of drought had left the reservoir ____, its once-formidable depths reduced to a muddy basin.",
      "drained",
      ["flooded","polluted","frozen"],
      "המעמקים הפכו לשלולית בוץ: drained = התרוקן.",
    ],
    [
      "The negotiator's ____ was legendary: she could sense, from a slight change in tone, precisely when an opponent was ready to compromise.",
      "insight",
      ["stubbornness","wealth","humor"],
      "קוראת רמזים עדינים: insight = חדות הבחנה, הבנה עמוקה.",
    ],
    [
      "The twins, though raised together, could hardly be more ____: one is shy and methodical, the other bold and impulsive.",
      "different",
      ["similar","friendly","balanced"],
      "אחד ביישן ושיטתי והשני נועז ופזיז. could hardly be more different = שונים עד קצה.",
    ],
    [
      "The company's accounts were so ____ that even experienced auditors could not trace where the money had gone.",
      "complicated",
      ["simple","public","outdated"],
      "רואי חשבון מנוסים אבדו בדרך: complicated = מסובך.",
    ],
    [
      "His ____ for detail was so strong that he personally checked every footnote of a thousand-page report.",
      "passion",
      ["dislike","tolerance","fear"],
      "בדק בעצמו כל הערת שוליים: passion = להט, אהבה עזה.",
    ],
    [
      "The novel's ____ narrator, who describes events she herself seems not to understand, forces readers to question every account.",
      "unreliable",
      ["cheerful","wealthy","talkative"],
      "מספרת שלא מבינה את מה שהיא מתארת גורמת לקוראים לפקפק. unreliable = לא אמין.",
    ],
    [
      "The proposal, though ____ in theory, would prove nearly impossible to implement given the region's fractured politics.",
      "admirable",
      ["illegal","expensive","confusing"],
      "Though מציג ניגוד: בתיאוריה ההצעה חיובית, ובפועל קשה ליישם. admirable = ראוי להערכה.",
    ],
    [
      "Only an ____ optimist would expect the talks to succeed after so many failures.",
      "incurable",
      ["occasional","reluctant","modest"],
      "אחרי כישלונות רבים עדיין מצפה להצלחה: incurable optimist = אופטימיסט חסר תקנה.",
    ],
    [
      "The senator's remarks, though couched in the language of concern, were in truth a thinly ____ threat.",
      "veiled",
      ["open","announced","celebrated"],
      "לשון דאגה שמסתירה איום: thinly veiled threat = איום מוסווה בקושי.",
    ],
    [
      "The manuscript's condition was so ____ that scholars were forbidden to touch it; only digital copies could be consulted.",
      "fragile",
      ["perfect","famous","recent"],
      "אסור לגעת בו: fragile = שביר.",
    ],
  ],
  restatement: [
    [
      "So absorbed was she in her work that she failed to notice the fire alarm.",
      "She was concentrating so intensely on her work that she did not notice the fire alarm.",
      [
        "She ignored the fire alarm because she wanted to finish her work.",
        "The fire alarm was so loud that she could not concentrate on her work.",
        "She noticed the fire alarm only after she had finished her work.",
      ],
      "So absorbed... that = כל כך שקועה ש־. failed to notice = לא שמה לב, בלי כוונה. לא התעלמה במכוון.",
    ],
    [
      "The committee, having considered all the evidence, saw no reason to alter its decision.",
      "After reviewing everything, the committee found no grounds to change its decision.",
      [
        "The committee changed its decision after considering all the evidence.",
        "The committee altered its decision without considering the evidence.",
        "The committee considered the evidence only after it had decided not to alter its decision.",
      ],
      "having considered = אחרי ששקלה. saw no reason to alter = לא ראתה סיבה לשנות.",
    ],
    [
      "Although the findings may well be correct, they have yet to be independently confirmed.",
      "The findings could be correct, but no outside researchers have verified them so far.",
      [
        "The findings have been independently confirmed, so they are probably correct.",
        "The findings are almost certainly incorrect, since no one has confirmed them.",
        "Independent researchers confirmed the findings even though they are probably incorrect.",
      ],
      "may well be = כנראה נכון, have yet to be = עדיין לא. עדיין אין אישור בלתי תלוי.",
    ],
    [
      "The lecturer, who is by no means a pessimist, nonetheless warned that the situation was grave.",
      "Although the lecturer is far from pessimistic, he warned that the situation was serious.",
      [
        "Because the lecturer is a pessimist, he warned that the situation was grave.",
        "The lecturer, a pessimist, played down how serious the situation was.",
        "The lecturer is by no means certain that the situation is grave, so he did not warn anyone.",
      ],
      "by no means = בשום אופן לא. nonetheless = בכל זאת. אינו פסימיסט, ובכל זאת הזהיר.",
    ],
    [
      "It was not until she retired that the full extent of her influence became apparent.",
      "Only after her retirement did people see how great her influence had been.",
      [
        "Her influence became apparent long before she retired.",
        "Her retirement ended an influence that had always been apparent.",
        "She retired because her influence had become too apparent.",
      ],
      "It was not until A that B = רק אחרי A קרה B. עוצמת ההשפעה התגלתה רק אחרי הפרישה.",
    ],
    [
      "Insofar as the data permit any conclusion, they point to a modest rather than a dramatic effect.",
      "To the extent that conclusions can be drawn from the data, the effect appears to be small, not large.",
      [
        "The data permit a conclusion only if the effect is dramatic rather than modest.",
        "The data point to a dramatic effect, which is larger than expected.",
        "The data show that the effect is modest, so every possible conclusion is permitted.",
      ],
      "Insofar as = במידה ש־. המסקנה זהירה: ככל שאפשר להסיק, ההשפעה צנועה ולא דרמטית.",
    ],
  ],
  passage: {
    title: "A Crisis of Replication",
    paragraphs: [
      "In 2015, a large collaboration of psychologists attempted to repeat one hundred published experiments. Fewer than half yielded results that matched the originals. The finding, which circulated under the alarming label of a \"replication crisis,\" prompted a period of soul-searching across the social and biomedical sciences, and it remains contested whether the label is apt or merely sensational.",
      "Several explanations have been advanced. The most uncomfortable concerns incentives. Journals prize novelty, and careers advance on the strength of publications; a researcher who obtains an ambiguous result is therefore tempted, often unconsciously, to analyze the data until something striking emerges. Each individual choice may be defensible, yet their cumulative effect is a literature populated by findings that owe more to flexibility in analysis than to any regularity in nature.",
      "Reformers have proposed remedies, among them pre-registration, whereby a researcher publicly commits to a hypothesis and analysis plan before collecting data. By removing the opportunity for post hoc rationalization, pre-registration makes it harder to mistake chance for discovery. Skeptics counter that rigid protocols may stifle the exploratory work from which many genuine discoveries have come, and that a field obsessed with procedure risks neglecting the quality of its ideas.",
      "It would be a mistake, however, to read the episode as an indictment of science itself. That a discipline can detect and publicize its own failures is arguably the strongest evidence of its health. The crisis, if it deserves the name, is less a collapse of method than a belated acknowledgment that method is exercised by people, and that people respond to the conditions in which they work.",
    ],
  },
  reading: [
    [
      "Which of the following best expresses the main idea of the passage?",
      "Failures to replicate research have exposed problems rooted in incentives and prompted debated reforms, without discrediting science as a whole.",
      [
        "Social scientists have deliberately fabricated results to advance their careers.",
        "Pre-registration has completely solved the problem of replication.",
        "Only half of all published research can be trusted.",
      ],
      "הטקסט מתאר את הבעיה, את הסיבות שלה (תמריצים), את התרופות השנויות במחלוקת, ומסכם שהמשבר אינו האשמה של המדע עצמו.",
    ],
    [
      "The phrase \"whether the label is apt or merely sensational\" suggests that",
      "some observers doubt that the word \"crisis\" accurately describes the situation.",
      [
        "the experiments were carried out carelessly.",
        "the term was invented by journalists.",
        "the failure to replicate is certain to be temporary.",
      ],
      "apt = מתאים, sensational = מלהיט. מחלוקת על כך שהמונח משקף את המצב או מנופח.",
      1,
    ],
    [
      "According to paragraph 2, a literature can become populated by unreliable findings because",
      "small choices that are each defensible add up in the direction of striking results.",
      [
        "researchers knowingly fabricate their data.",
        "ambiguous results are never submitted to journals.",
        "the natural world contains too few regularities to study.",
      ],
      "הפסקה אומרת ש־each individual choice may be defensible, אבל ההצטברות מייצרת ממצאים שנובעים מגמישות בניתוח ולא מחוקיות בטבע.",
      2,
    ],
    [
      "Skeptics of pre-registration argue that it might",
      "discourage the open-ended exploration from which discoveries often come.",
      [
        "allow researchers to rationalize their results afterward.",
        "prevent journals from valuing novelty.",
        "reduce the number of researchers willing to collect data.",
      ],
      "הספקנים טוענים שפרוטוקולים נוקשים עלולים לחנוק עבודת חקר פתוחה. ההצדקה בדיעבד היא מה שהרישום המוקדם בא למנוע.",
      3,
    ],
    [
      "Which of the following best describes the author's attitude toward the \"crisis\" in the final paragraph?",
      "Measured: acknowledging real flaws while seeing in the response a sign of strength.",
      [
        "Alarmed: convinced that scientific method has collapsed.",
        "Dismissive: insisting that the problem has been exaggerated.",
        "Resigned: convinced that nothing can be done.",
      ],
      "המחבר מזהה כשל אמיתי, אבל טוען שיכולת של תחום לזהות ולפרסם את כשליו היא ראיה לבריאותו. לכן זו עמדה מאוזנת.",
      4,
    ],
  ],
});
