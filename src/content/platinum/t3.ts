import { build } from "./build";

// Platinum III · Sovereign
export const sovereign = build(3, {
  sentence: [
    [
      "The diplomat's ____ response, neither accepting nor rejecting the offer, allowed both sides to claim a small victory.",
      "cautious",
      ["angry","generous","immediate"],
      "לא קיבל ולא דחה: תשובה זהירה. cautious = זהיר.",
    ],
    [
      "Although the manuscript was long thought to be authentic, recent analysis of its ink has ____ that claim.",
      "weakened",
      ["supported","repeated","explained"],
      "Although מציג ניגוד: חשבו שהיא אותנטית, אבל בדיקת הדיו עושה את ההפך. weakened = החלישה.",
    ],
    [
      "The philanthropist's generosity was ____: she gave without seeking recognition, and often without revealing her name.",
      "modest",
      ["public","calculated","reluctant"],
      "תרמה בלי חיפוש הכרה: modest = צנוע.",
    ],
    [
      "The lawyer's ____ cross-examination left the witness visibly shaken and, by the end, unable to repeat his original story.",
      "relentless",
      ["gentle","brief","friendly"],
      "העד נשבר בסוף: חקירה בלתי פוסקת. relentless = בלי רחמים, בלי הפסקה.",
    ],
    [
      "Economists warned that the stimulus, though politically popular, would merely ____ the underlying problem rather than resolve it.",
      "delay",
      ["solve","explain","create"],
      "merely... rather than resolve = רק דוחה את הבעיה בלי לפתור. delay = לדחות, לעכב.",
    ],
    [
      "The critic's reputation for ____ was well deserved: she was never swayed by friendship, fashion or the author's fame.",
      "objectivity",
      ["generosity","humor","speed"],
      "לא הושפעה מחברות, אופנה או תהילה: objectivity = אובייקטיביות.",
    ],
    [
      "The two theories are not ____: elements of each can be combined into a more complete account.",
      "incompatible",
      ["popular","recent","complex"],
      "אפשר לשלב ביניהן, ולכן אינן סותרות. incompatible = בלתי מתיישב.",
    ],
    [
      "The senator's favorite ____ about the budget, repeated in every speech, began to sound less like conviction than like habit.",
      "slogan",
      ["secret","apology","question"],
      "משפט שחוזר בכל נאום: slogan = סיסמה.",
    ],
    [
      "Because the species is so ____ in its habits, feeding only on a single type of bamboo, even slight changes to the forest threaten its survival.",
      "specialized",
      ["flexible","aggressive","social"],
      "אוכל רק סוג אחד של במבוק: specialized = מתמחה, מוגבל להרגל אחד.",
    ],
    [
      "Though the novel was ____ received on publication, selling few copies, it has since come to be regarded as a masterpiece.",
      "poorly",
      ["warmly","widely","eagerly"],
      "מכר מעט עותקים, ולכן התקבל בצורה גרועה. poorly = גרוע.",
    ],
    [
      "The ruler's ____ policies, which enriched his supporters at the expense of the general population, eventually provoked a revolt.",
      "unfair",
      ["balanced","cautious","modern"],
      "העשירו תומכים על חשבון הכלל: מדיניות לא הוגנת. unfair = לא הוגן.",
    ],
    [
      "In the ____ of the debate, neither side was willing to concede even the most trivial point.",
      "heat",
      ["silence","summary","aftermath"],
      "in the heat of the debate = בעיצומו של הוויכוח, כשהרוחות סוערות.",
    ],
  ],
  restatement: [
    [
      "Hardly had the speaker begun when the microphone failed.",
      "The microphone failed almost as soon as the speaker started.",
      [
        "The speaker began only after the microphone failed.",
        "The microphone failed long before the speaker began.",
        "The speaker could not begin because the microphone was not working.",
      ],
      "Hardly had A... when B = B קרה מיד אחרי ש־A התחיל. המיקרופון התקלקל תוך כדי תחילת הנאום.",
    ],
    [
      "Only by cutting costs can the company hope to survive.",
      "The company's survival depends on reducing its costs.",
      [
        "The company will survive whether or not it cuts costs.",
        "The company can survive only if it increases its spending.",
        "Cutting costs will not help the company survive.",
      ],
      "Only by + V-ing + היפוך = הדרך היחידה היא. הדרך היחידה לשרוד היא קיצוץ בעלויות.",
    ],
    [
      "The jury was reluctant to convict, lest it punish an innocent man.",
      "The jury hesitated to convict because it feared punishing an innocent man.",
      [
        "The jury convicted him in order to avoid punishing an innocent man.",
        "The jury was reluctant to convict because the man was clearly guilty.",
        "The jury punished an innocent man because it was reluctant to convict.",
      ],
      "lest = מחשש ש־, כדי שלא. החשש להעניש חף מפשע הוא הסיבה להססנות.",
    ],
    [
      "No sooner had the results been announced than protests broke out.",
      "Protests began immediately after the results were announced.",
      [
        "The results were announced only after protests broke out.",
        "No protests broke out once the results were announced.",
        "Protests broke out long after the results were announced.",
      ],
      "No sooner had A than B = B קרה מיד אחרי A. התוצאות הוכרזו ומיד פרצו הפגנות.",
    ],
    [
      "Scarcely any of the committee's proposals were adopted.",
      "Almost none of the committee's proposals were adopted.",
      [
        "Nearly all of the committee's proposals were adopted.",
        "Only a few of the committee's proposals were rejected.",
        "Some of the proposals were adopted without any discussion.",
      ],
      "scarcely any = כמעט אף אחת. almost none = כמעט אף אחת. האפשרות עם only a few rejected אומרת שרובן אומצו.",
    ],
    [
      "It is her ability to listen, rather than her eloquence, that makes her an exceptional negotiator.",
      "She is an exceptional negotiator chiefly because she listens well, not because she speaks eloquently.",
      [
        "Her eloquence, not her ability to listen, is what makes her an exceptional negotiator.",
        "She is an exceptional negotiator even though she listens poorly and speaks eloquently.",
        "Listening to her is what makes her an exceptional speaker.",
      ],
      "It is X, rather than Y, that = הסיבה היא X ולא Y. כושר ההקשבה הוא העיקר, לא רהיטות.",
    ],
  ],
  passage: {
    title: "The Placebo, Reconsidered",
    paragraphs: [
      "For much of the twentieth century, the placebo was regarded as little more than a nuisance: an inert substance used to ensure that the effect of a real drug could be measured against a baseline of imagination. Clinical trials were designed to subtract it, as one subtracts noise from a signal. Only gradually did researchers begin to ask a more interesting question: why does an inert pill sometimes relieve pain at all?",
      "Brain-imaging studies have offered partial answers. When patients expect relief, regions associated with pain processing show measurably reduced activity, and the brain releases its own opioid-like chemicals. In other words, the placebo effect is not a mere illusion in the patient's mind; it is a genuine physiological response triggered by belief. The effect is also remarkably sensitive to context. In some studies, larger pills have worked better than small ones, injections better than tablets, and expensive brands better than cheaper identical ones, findings that suggest that what patients respond to is not the substance but the meaning attached to it.",
      "These discoveries have provoked an ethical debate. If a placebo can relieve suffering, some argue, physicians ought to be free to prescribe one. Critics reply that doing so requires deception, which erodes the trust on which medicine depends. A surprising finding complicates the dispute: in several small trials, patients who were told candidly that their pills contained no active ingredient still reported improvement. If these results hold, honesty and benefit may not be incompatible after all.",
      "It would be premature, however, to celebrate. The placebo effect appears strongest for subjective symptoms such as pain and nausea, and there is little evidence that it can shrink a tumor or cure an infection. Its proper role, most researchers conclude, is not as a substitute for treatment but as a reminder that healing is shaped by more than chemistry.",
    ],
  },
  reading: [
    [
      "The author's main purpose is to",
      "describe how scientific understanding of the placebo effect has changed, and where its limits lie.",
      [
        "argue that doctors should prescribe placebos routinely.",
        "show that the placebo effect is only an illusion.",
        "prove that expensive medicines are no better than cheap ones.",
      ],
      "הטקסט עובר מהתייחסות לפלסבו כרעש, להסבר פיזיולוגי, לוויכוח אתי, ולמגבלות. הוא אינו ממליץ לרשום פלסבו ואינו טוען שהאפקט אשליה.",
    ],
    [
      "According to paragraph 1, early clinical trials treated the placebo effect as",
      "interference to be removed so that the real drug's effect could be measured.",
      [
        "the main subject of the research.",
        "proof that real drugs were unnecessary.",
        "a benefit that should be maximized.",
      ],
      "נאמר שהניסויים תוכננו לנכות אותו, כמו שמנכים רעש מאות. זה היה מטרד, לא יעד.",
      1,
    ],
    [
      "The author mentions pill size, injections and price in order to",
      "suggest that patients respond to the meaning they attach to a treatment, not only to its substance.",
      [
        "prove that larger pills contain more active ingredient.",
        "argue that injections should replace tablets.",
        "criticize the pricing of pharmaceutical companies.",
      ],
      "הממצאים הללו הם דוגמאות להקשר. המשפט האחרון בפסקה מסכם: מה שמשפיע הוא המשמעות ולא החומר.",
      2,
    ],
    [
      "The finding that patients improved even when told their pills were inert complicates the ethical debate because it",
      "suggests that the benefit might be obtained without deceiving patients.",
      [
        "proves that placebos have no effect at all.",
        "shows that deception is necessary for placebos to work.",
        "demonstrates that the critics are being dishonest.",
      ],
      "הטיעון נגד פלסבו הוא שצריך להונות. אם זה עובד גם בגילוי לב, הניגוד בין יושר לתועלת פחות חד.",
      3,
    ],
    [
      "Which of the following would the author most likely agree with?",
      "The placebo effect is real but limited, and it cannot replace treatment for serious disease.",
      [
        "Placebos are most effective in treating infections.",
        "Because the effect depends on belief, it has no physical basis.",
        "Further research on placebos is unnecessary.",
      ],
      "פסקה 2 קובעת שהתגובה פיזיולוגית אמיתית, ופסקה 4 מגבילה אותה לתסמינים סובייקטיביים ואומרת שהיא לא תחליף לטיפול.",
      4,
    ],
  ],
});
