import type { Question } from "./questions";
import { sc } from "./bankHelpers";

// Prefix and suffix drills (ids af-01…af-30), shown at /learn/affixes and in /practice?type=affixes.
// Kept OUT of the main `questions` list on purpose: the "what does the word mean" format is not
// in the real exam, so these never reach the simulations or the daily question.
// Original writing for Anglit.

export const affixQuestions: Question[] = [
  // ─── The right form (suffixes) ───
  sc("af-01", "The teacher praised the student's ____ in solving difficult problems.", ["creativity", "creative", "creatively", "create"], "אחרי 's בא שם עצם. הסופית -ity יוצרת שם עצם: creativity.", "קבעו קודם איזה סוג מילה המשפט צריך, ורק אז בדקו את הסופיות."),
  sc("af-02", "Her ____ approach helped her solve the problem.", ["practical", "practice", "practically", "practicality"], "לפני שם עצם (approach) בא תואר. הסופית -al יוצרת תואר: practical.", "לפני שם עצם? חפשו תואר. -al, -ous, -ive, -ful הן סופיות של תארים."),
  sc("af-03", "The athlete trained ____ for months before the final.", ["intensely", "intense", "intensity", "intensify"], "הפועל trained צריך תואר פועל, והסופית -ly מסמנת אותו: intensely.", "מי שמתאר פועל מסתיימת לרוב ב-ly."),
  sc("af-04", "The new medicine will ____ the immune system.", ["strengthen", "strength", "strong", "strongly"], "אחרי will בא פועל. הסופית -en יוצרת פועל: strengthen = לחזק.", "אחרי will / to בא פועל. -en, -ize, -ify, -ate הן סופיות של פעלים."),
  sc("af-05", "We were impressed by the ____ of the instructions.", ["clarity", "clear", "clearly", "clarify"], "אחרי the ולפני of בא שם עצם. הסופית -ity יוצרת שם עצם: clarity = בהירות.", "the ____ of = שם עצם."),
  sc("af-06", "The restaurant owner was ____ about the new menu.", ["enthusiastic", "enthusiasm", "enthusiastically", "enthuse"], "אחרי was בא תואר. הסופית -ic יוצרת תואר: enthusiastic = נלהב.", "אחרי was / is / felt בא תואר."),
  sc("af-07", "Her ____ was clear: she wanted to leave early.", ["decision", "decide", "decisive", "decisively"], "אחרי her בא שם עצם. הסופית -sion יוצרת שם עצם: decision = החלטה.", "אחרי her / his / the בא שם עצם."),
  sc("af-08", "Several ____ attended the conference this year.", ["participants", "participate", "participation", "participatory"], "אחרי Several בא שם עצם ברבים. הסופית -ant מסמנת אדם: participant, ועם s: participants.", "Several / many דורשים שם עצם ברבים."),
  sc("af-09", "The doctor warned that the treatment could be ____ if used too often.", ["dangerous", "danger", "dangerously", "endanger"], "אחרי be בא תואר. הסופית -ous יוצרת תואר: dangerous.", "be + ____ = תואר."),
  sc("af-10", "The school plans to ____ its science labs next year.", ["modernize", "modern", "modernity", "modernly"], "אחרי to בא פועל. הסופית -ize יוצרת פועל: modernize = לעדכן.", "plans to + ____ = פועל."),

  // ─── Meaning from the parts ───
  sc("af-11", "\"The old photographs are irreplaceable.\" What does \"irreplaceable\" mean?", ["impossible to replace", "easy to replace", "replaced twice", "worth nothing"], "ir- = שלילה, replace = להחליף, -able = אפשר. לכן: אי אפשר להחליף.", "פרקו לתחילית + שורש + סופית.", ["irreplaceable"]),
  sc("af-12", "\"The company decided to decentralize its offices.\" What does \"decentralize\" mean?", ["spread them away from one center", "move all of them to one place", "close them", "rebuild them"], "de- = היפוך, central = מרכזי, -ize = לעשות. לפזר ולא לרכז.", "de- הופכת את הפעולה.", ["decentralize"]),
  sc("af-13", "\"His behavior was uncharacteristic.\" What does \"uncharacteristic\" mean?", ["not typical of him", "typical of him", "very bad", "full of character"], "un- = שלילה. characteristic = אופייני, ולכן uncharacteristic = לא אופייני.", "un- = לא.", ["uncharacteristic"]),
  sc("af-14", "\"The twins are interdependent.\" What does \"interdependent\" mean?", ["each depends on the other", "completely independent", "depend on no one", "depend only on their parents"], "inter- = בין, depend = להיות תלוי, ולכן תלויים זה בזה.", "inter- = בין, הדדי.", ["interdependent"]),
  sc("af-15", "\"The lawyer called the evidence inadmissible.\" What does \"inadmissible\" mean?", ["cannot be accepted", "can be accepted", "very strong", "missing"], "in- = שלילה, admit = לקבל, -ible = אפשר. אי אפשר לקבל את הראיה.", "in- + -ible = אי אפשר.", ["inadmissible"]),
  sc("af-16", "\"She is a multilingual translator.\" What does \"multilingual\" mean?", ["speaks several languages", "speaks one language", "cannot speak", "writes only"], "multi- = הרבה, lingual קשור לשפה. מדברת כמה שפות.", "multi- = הרבה.", ["multilingual"]),
  sc("af-17", "\"The mayor was accused of mismanagement.\" What does \"mismanagement\" mean?", ["managing badly", "managing well", "taking over the management", "having no staff"], "mis- = בטעות או רע, management = ניהול. ניהול לקוי.", "mis- = לא כמו שצריך.", ["mismanagement"]),
  sc("af-18", "\"The antibiotics are ineffective against the virus.\" What does \"ineffective\" mean?", ["do not work", "work well", "work faster", "are expensive"], "in- = שלילה, effective = יעיל. לא יעילות, כלומר לא עובדות.", "in- = לא.", ["ineffective"]),
  sc("af-19", "\"The company's overdependence on one customer is risky.\" What does \"overdependence\" mean?", ["depending too much", "depending too little", "being independent", "having no customers"], "over- = יותר מדי, dependence = תלות. תלות יתר.", "over- = יותר מדי. under- = פחות מדי.", ["overdependence"]),
  sc("af-20", "\"The team had to reassess its goals.\" What does \"reassess\" mean?", ["evaluate them again", "evaluate them for the first time", "cancel them", "evaluate them too early"], "re- = שוב, assess = להעריך. להעריך מחדש.", "re- = שוב.", ["reassess"]),

  // ─── Which negative prefix? ───
  sc("af-21", "It is ____ to park in front of the hospital entrance.", ["illegal", "unlegal", "inlegal", "dislegal"], "לפני האות l מוסיפים il-: illegal.", "il- לפני l."),
  sc("af-22", "The test was ____ for most students; nobody could finish it.", ["impossible", "unpossible", "dispossible", "nonpossible"], "לפני האות p מוסיפים im-: impossible.", "im- לפני p, b, m."),
  sc("af-23", "His handwriting is so ____ that nobody can read it.", ["illegible", "unlegible", "inlegible", "dislegible"], "לפני האות l מוסיפים il-: illegible = בלתי קריא.", "il- לפני l."),
  sc("af-24", "It is ____ to speak while someone else is talking.", ["impolite", "unpolite", "dispolite", "nonpolite"], "לפני האות p מוסיפים im-: impolite = לא מנומס.", "im- לפני p."),
  sc("af-25", "A ____ employee who shares company secrets cannot be trusted.", ["disloyal", "unloyal", "inloyal", "nonloyal"], "disloyal = לא נאמן. dis- ברשימת המילים שצריך לזכור.", "dis- נפוצה בתארים כמו dishonest, disloyal, dissatisfied."),
  sc("af-26", "The results were ____, so the researchers repeated the experiment.", ["inconsistent", "unconsistent", "disconsistent", "nonconsistent"], "inconsistent = לא עקבי. in- מופיעה לפני האות c.", "in- לפני רוב האותיות האחרות."),
  sc("af-27", "He gave an ____ answer, so the teacher marked it wrong.", ["incorrect", "uncorrect", "discorrect", "nocorrect"], "incorrect = שגוי. in- לפני האות c.", "incorrect, inaccurate, indirect: in-."),
  sc("af-28", "The train times are ____: sometimes it is early, sometimes late.", ["irregular", "unregular", "inregular", "disregular"], "לפני האות r מוסיפים ir-: irregular = לא סדיר.", "ir- לפני r."),
  sc("af-29", "The company was accused of ____ behavior, because it deceived its customers.", ["dishonest", "unhonest", "inhonest", "nonhonest"], "dishonest = לא ישר. dis- ברשימת המילים שצריך לזכור.", "dishonest: dis-."),
  sc("af-30", "It is ____ to expect the work to be finished in one hour.", ["unreasonable", "inreasonable", "disreasonable", "nonreasonable"], "unreasonable = לא סביר. un- נפוצה ביותר עם תארים.", "un- היא ברירת המחדל כשאין כלל, ולכן לומדים מילה מילה."),
];
