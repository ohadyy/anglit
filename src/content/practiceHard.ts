import type { Passage, Question } from "./questions";
import type { Level } from "./difficulty";
import { toQuestion } from "./platinum/build";

// Practice questions at levels 3–5 (see content/difficulty.ts), added 2026-11-04 so that
// practice reaches the level of the exam's middle and harder chapters. They are part of the
// practice bank, never of a test: the tests draw from content/examPool.ts. The correct
// option is written first; toQuestion() shuffles by id. Original writing for Anglit.

type Item = [level: Level, stem: string, correct: string, wrong: [string, string, string], why: string, paragraph?: number];

const sentence: Item[] = [
  // Level 3
  [3, "The scientist was ____ about the results at first, but after the third successful trial she began to share them with colleagues.", "cautious", ["careless", "boastful", "ignorant"], "but after the third trial she began to share: בהתחלה היא נזהרה. cautious = זהיר."],
  [3, "Because the old bridge could no longer ____ heavy traffic, the city built a new one beside it.", "withstand", ["invite", "attract", "prohibit"], "גשר שכבר לא עומד בעומס מחליפים. withstand = לעמוד ב־, לשאת."],
  [3, "The charity relies ____ on donations from the public, receiving almost no money from the government.", "heavily", ["rarely", "barely", "slightly"], "כמעט בלי כסף מהממשלה, אז תלויה מאוד בתרומות. rely heavily on = להסתמך מאוד על."],
  [3, "The documentary ____ the lives of three families who moved to the city in search of work.", "depicts", ["postpones", "prohibits", "neglects"], "סרט תיעודי מציג חיים של אנשים. depict = לתאר, להציג."],
  [3, "____ the warnings of his doctors, the singer continued to perform every night until he lost his voice.", "Ignoring", ["Following", "Accepting", "Obeying"], "המשיך להופיע עד שאיבד את הקול, כלומר לא הקשיב לרופאים. ignore = להתעלם."],
  [3, "The new manager quickly ____ a reputation for fairness by listening to every side before making a decision.", "earned", ["lost", "borrowed", "denied"], "הקשבה לכל הצדדים בונה מוניטין. earn a reputation = לקנות לעצמו שם."],
  [3, "The rules of the game are so ____ that most children learn them within a few minutes.", "straightforward", ["intricate", "obscure", "contradictory"], "ילדים לומדים תוך דקות, אז החוקים פשוטים. straightforward = פשוט, ישיר."],
  [3, "Many traditional crafts are in danger of ____, as fewer young people are willing to learn them.", "disappearing", ["spreading", "improving", "multiplying"], "פחות צעירים לומדים, אז המלאכות עלולות להיעלם. in danger of = בסכנת."],
  [3, "The museum's director ____ that the painting was a fake, but tests later proved it to be genuine.", "suspected", ["proved", "ensured", "guaranteed"], "but tests later proved it genuine: היא רק חשדה, לא הוכיחה. suspect = לחשוד."],
  [3, "The athlete's ____ recovery from a serious knee injury surprised even her own doctors.", "remarkable", ["predictable", "routine", "expected"], "אם אפילו הרופאים הופתעו, ההחלמה הייתה יוצאת דופן. remarkable = מרשים, יוצא דופן."],
  [3, "The village is so ____ that the nearest shop is a two-hour drive away.", "remote", ["crowded", "central", "modern"], "שעתיים נסיעה לחנות = מרוחק. remote = נידח, מרוחק."],
  [3, "The professor encouraged her students to ____ every claim they read online before repeating it.", "verify", ["invent", "ignore", "exaggerate"], "לפני שחוזרים על טענה, בודקים אותה. verify = לאמת."],
  [3, "Although the hotel advertised itself as luxurious, the rooms were ____ and poorly cleaned.", "shabby", ["elegant", "spacious", "spotless"], "Although luxurious … poorly cleaned: ניגוד, החדרים היו מוזנחים. shabby = מוזנח, בלוי."],
  [3, "The company's profits have remained ____ for five years, neither rising nor falling significantly.", "stable", ["volatile", "soaring", "declining"], "neither rising nor falling = יציב. stable = יציב. volatile = הפכפך, ההפך."],
  [3, "The author ____ her childhood in a small fishing village as the inspiration for her first novel.", "cites", ["forbids", "conceals", "denies"], "cite X as = לציין את X בתור. היא מציינת את הילדות כמקור ההשראה."],

  // Level 4
  [4, "The senator's speech was so ____ that by the end even his supporters could not say what he actually proposed.", "convoluted", ["concise", "transparent", "persuasive"], "גם התומכים לא הבינו מה הוצע: הנאום היה מסובך ומפותל. convoluted = מסורבל, מפותל."],
  [4, "Researchers warn that the benefits of the diet have been greatly ____ by companies that sell its products.", "exaggerated", ["understated", "documented", "verified"], "חברות שמוכרות את המוצר מגזימות ביתרונות. exaggerate = להגזים."],
  [4, "Far from being ____, the decision to close the factory had been planned for more than two years.", "impulsive", ["deliberate", "calculated", "premeditated"], "Far from = ההפך מ־. תוכנן שנתיים, אז זה לא היה אימפולסיבי. שלוש האחרות מתארות תכנון."],
  [4, "The witness's testimony ____ the defendant's alibi, placing him at the scene an hour before he claimed to have arrived.", "contradicted", ["confirmed", "supported", "echoed"], "העדות שמה אותו במקום לפני שטען שהגיע, אז היא סותרת את האליבי. contradict = לסתור."],
  [4, "Critics accused the director of ____ history, since the film changed key events to make its hero more sympathetic.", "distorting", ["preserving", "documenting", "honoring"], "שינוי אירועים מרכזיים = עיוות. distort = לעוות, לסלף."],
  [4, "The treatment's effects are ____: they disappear within a few weeks unless it is repeated.", "transient", ["permanent", "irreversible", "enduring"], "נעלמים תוך כמה שבועות = זמניים. transient = חולף, זמני."],
  [4, "Her ____ in three languages made her an obvious choice for the post at the embassy.", "fluency", ["reluctance", "ignorance", "hesitation"], "שלוש שפות ושגרירות: שליטה שוטפת בשפות. fluency = שטף, רהיטות."],
  [4, "The report's authors were careful to ____ their conclusions, noting that the sample was small and the results preliminary.", "qualify", ["exaggerate", "publicize", "abandon"], "qualify a conclusion = לסייג מסקנה. הם הוסיפו הסתייגויות, ולא ויתרו עליה."],
  [4, "The ____ between the two neighboring countries dates back centuries, to a dispute over a single river valley.", "animosity", ["alliance", "harmony", "friendship"], "סכסוך בן מאות שנים = איבה. animosity = עוינות, איבה."],
  [4, "The novel was rejected by a dozen publishers, a fact that now seems ____ given its enormous success.", "ironic", ["inevitable", "logical", "appropriate"], "ספר שנדחה ואז הצליח מאוד: זה אירוני. ironic = אירוני, הפוך ממה שציפו."],
  [4, "So ____ were the instructions that two teams following them built entirely different machines.", "ambiguous", ["precise", "explicit", "detailed"], "אותן הוראות ושתי מכונות שונות: אפשר היה להבין אותן בשתי דרכים. ambiguous = דו משמעי."],
  [4, "The new mayor promised to ____ the corruption that had flourished under her predecessor.", "eradicate", ["tolerate", "overlook", "encourage"], "ראש עירייה חדשה מבטיחה לשרש שחיתות. eradicate = למגר, לשרש."],

  // Level 5
  [5, "The professor's ____ remarks, delivered in a flat voice, left the audience unsure whether he was joking.", "sardonic", ["earnest", "effusive", "sincere"], "לא ברור אם הוא צוחק, בקול שטוח: לגלוג יבש. sardonic = לגלגני, ציני."],
  [5, "The memoir is remarkably ____ about its author's failures, devoting entire chapters to decisions she now regrets.", "forthright", ["evasive", "reticent", "guarded"], "פרקים שלמים על הכישלונות = גלוי וישיר. forthright = גלוי, ישיר. שלוש האחרות = מסתיר."],
  [5, "Rather than ____ the scandal, the minister's carefully worded denial only fueled speculation.", "quelling", ["stoking", "amplifying", "prolonging"], "Rather than = במקום. ההכחשה הגבירה את השמועות במקום להשקיט. quell = לדכא, להשקיט."],
  [5, "Decades of ____ funding had left the laboratory with equipment so outdated that some experiments were simply impossible.", "meager", ["lavish", "ample", "generous"], "ציוד מיושן מאוד = תקציב דל. meager = דל, זעום."],
  [5, "The theory is admirably ____: it explains a wide range of phenomena with a single, simple principle.", "parsimonious", ["convoluted", "redundant", "cumbersome"], "עיקרון אחד פשוט שמסביר הרבה = חסכוני. parsimonious (בתיאוריה) = חסכוני, בלי עודף הנחות."],
  [5, "The negotiator's ____ manner concealed a firm determination not to concede a single point.", "affable", ["abrasive", "belligerent", "curt"], "concealed = הסתיר. מאחורי נחישות קשוחה הסתתרה התנהגות נעימה. affable = נעים, חביב."],
  [5, "The evidence, though ____, was enough to persuade the committee to reopen the investigation.", "circumstantial", ["conclusive", "irrefutable", "overwhelming"], "though = אף ש־. הראיות היו חלשות, ובכל זאת הספיקו. circumstantial = נסיבתי."],
  [5, "Her rise to the top of the company was ____: within five years she had gone from intern to chief executive.", "meteoric", ["gradual", "halting", "modest"], "ממתמחה למנכ\"לית תוך חמש שנים = עלייה מטאורית. meteoric = מהיר ומרשים."],
  [5, "The critic dismissed the exhibition as ____, a collection of fashionable gestures with nothing underneath.", "vacuous", ["profound", "substantive", "rigorous"], "with nothing underneath = ריק מתוכן. vacuous = ריק, חסר תוכן."],
  [5, "The two governments' statements were so ____ that diplomats suspected they had been drafted together.", "congruent", ["divergent", "discordant", "antithetical"], "חשדו שנכתבו יחד, אז ההצהרות היו תואמות מאוד. congruent = תואם, חופף."],
];

const restatement: Item[] = [
  // Level 3
  [3, "Rarely does the river flood in summer.", "The river seldom floods during the summer.", ["The river often floods in summer.", "The river floods only in summer.", "The river has never flooded in summer."], "Rarely = seldom = לעיתים רחוקות. זה לא never."],
  [3, "The concert was postponed owing to the singer's illness.", "Because the singer was ill, the concert was delayed.", ["The singer became ill because the concert was postponed.", "The concert went ahead although the singer was ill.", "The concert was cancelled, and then the singer became ill."], "owing to = בגלל. postponed = נדחה, לא בוטל."],
  [3, "Were it not for the map, we would have got lost.", "The map stopped us from getting lost.", ["We got lost even though we had a map.", "We got lost because the map was wrong.", "We did not need the map to find our way."], "Were it not for = אלמלא. בלי המפה היינו הולכים לאיבוד, אז המפה הצילה אותנו."],
  [3, "Neither of the two candidates had any experience in government.", "Both candidates lacked experience in government.", ["Only one candidate had experience in government.", "Both candidates had a lot of experience in government.", "One candidate had more experience than the other."], "Neither of the two = אף אחד מהשניים. לשניהם לא היה ניסיון."],
  [3, "The museum is open daily except on public holidays.", "The museum is closed only on public holidays.", ["The museum opens only on public holidays.", "The museum is closed every day except public holidays.", "The museum is open on public holidays and closed on other days."], "except = חוץ מ־. פתוח כל יום, וסגור רק בחגים."],
  [3, "She had barely sat down when the phone rang.", "The phone rang just after she sat down.", ["She sat down because the phone rang.", "The phone rang long before she sat down.", "She could not sit down because the phone kept ringing."], "had barely … when = בקושי … כש־. הטלפון צלצל מיד אחרי שהתיישבה."],
  [3, "Not all the experts agree that the painting is genuine.", "Some experts doubt that the painting is authentic.", ["None of the experts believe the painting is genuine.", "All the experts agree that the painting is a fake.", "Every expert is sure the painting is genuine."], "Not all = לא כולם. יש מומחים שמפקפקים, אבל לא כולם."],
  [3, "The policy was abandoned once its costs became clear.", "When the cost of the policy became obvious, it was dropped.", ["The policy's costs rose after it was abandoned.", "The policy was kept although its costs were clear.", "The policy became clear once it was abandoned."], "once = ברגע ש־. קודם התבררה העלות, ואז ויתרו על המדיניות."],
  [3, "Only a fraction of the funds actually reached the people in need.", "Most of the money did not get to those who needed it.", ["Almost all the funds reached the people in need.", "None of the money was meant for people in need.", "The people in need received more money than expected."], "Only a fraction = רק חלק קטן. רוב הכסף לא הגיע."],
  [3, "The harder the questions became, the more slowly she worked.", "She worked more slowly as the questions grew more difficult.", ["She worked faster as the questions became harder.", "The questions became harder because she worked slowly.", "She stopped working when the questions became hard."], "The harder … the more slowly = ככל ש… כך. ככל שקשה יותר, איטית יותר."],

  // Level 4
  [4, "It was not the price but the delivery time that persuaded them to choose the second supplier.", "They chose the second supplier because of its delivery time rather than its price.", ["They chose the second supplier because it was cheaper.", "Both the price and the delivery time made them choose the second supplier.", "They rejected the second supplier because of its delivery time."], "not X but Y = לא X אלא Y. הסיבה היחידה: זמן האספקה."],
  [4, "Hardly a week goes by without a new study on the effects of social media.", "New studies on the effects of social media appear almost every week.", ["Studies on social media are published only once a week.", "There have been very few studies on social media this week.", "A week rarely passes before a study on social media is cancelled."], "Hardly a week goes by without = כמעט אין שבוע בלי. כלומר כמעט כל שבוע."],
  [4, "The proposal, for all its flaws, is the best option currently available.", "Although it has weaknesses, the proposal is better than any other option at present.", ["Because of its flaws, the proposal is not the best option.", "The proposal has no flaws, so it is the best option.", "There are several better options than the proposal."], "for all its flaws = למרות כל פגמיו. יש פגמים, ועדיין זו האפשרות הטובה ביותר."],
  [4, "Had the warning been heeded, the damage would have been far less severe.", "The damage was worse than it needed to be because the warning was ignored.", ["The warning was heeded, so the damage was not severe.", "The damage was severe although everyone followed the warning.", "The warning caused the damage to become more severe."], "Had … been heeded = אילו הקשיבו. לא הקשיבו לאזהרה, ולכן הנזק היה גדול יותר."],
  [4, "Only after several failed attempts did the team find a method that worked.", "The team found a working method, but not before failing a number of times.", ["The team's first attempt was successful.", "The team stopped trying after several failed attempts.", "The method failed after it had worked several times."], "Only after … did = רק אחרי. קודם כמה כישלונות, ואז שיטה שעובדת."],
  [4, "The museum's collection is impressive less for its size than for its quality.", "The collection is notable mainly for the quality of its items, not for how large it is.", ["The collection is impressive both because of its size and its quality.", "The collection is large but of poor quality.", "The collection is less impressive than its size suggests."], "less for X than for Y = פחות בגלל X ויותר בגלל Y. העיקר: האיכות."],
  [4, "There is no reason to believe that the decline in sales will continue.", "Nothing suggests that sales will keep falling.", ["Sales will certainly continue to decline.", "There is no reason for the decline in sales.", "Sales have not declined at all."], "אין סיבה להאמין שהירידה תימשך. הירידה עצמה כן קרתה."],
  [4, "Much of what we know about the ancient city comes from a single surviving manuscript.", "A large part of our knowledge of the ancient city is based on one manuscript that has survived.", ["Many manuscripts about the ancient city have survived.", "The ancient city produced only one manuscript.", "We know little about the ancient city despite many surviving manuscripts."], "Much of = חלק גדול מ־. a single surviving manuscript = כתב יד אחד ששרד."],
  [4, "So convincing was her performance that many viewers believed the story was true.", "Her acting was so persuasive that many people in the audience thought the events were real.", ["Many viewers knew the story was true, so her performance was convincing.", "Her performance was unconvincing, and viewers doubted the story.", "Viewers believed the story only because it was true."], "So convincing was … that = כל כך משכנעת ש־. המשחק הוא הסיבה, האמונה היא התוצאה."],

  // Level 5
  [5, "Scarcely had the ink dried on the agreement when both sides began to accuse each other of violating it.", "Almost immediately after the agreement was signed, each side claimed the other had broken it.", ["Both sides accused each other before the agreement was signed.", "The agreement was signed only after both sides stopped accusing each other.", "Both sides waited a long time before claiming that the agreement had been violated."], "Scarcely had … when = בקושי … וכבר. the ink dried = הדיו התייבשה, כלומר מיד אחרי החתימה."],
  [5, "The author's argument, persuasive as it is, rests on an assumption that few historians would accept.", "Although the author's argument is convincing, it depends on a premise that most historians would reject.", ["The author's argument is unconvincing because few historians support it.", "Few historians accept the author's argument, although its assumption is widely accepted.", "Most historians accept the assumption on which the argument rests."], "persuasive as it is = משכנע ככל שיהיה. few would accept = רובם ידחו."],
  [5, "Far from discouraging the young scientist, the rejection of her paper only strengthened her resolve.", "The rejection of her paper made the young scientist more determined rather than less.", ["The young scientist gave up after her paper was rejected.", "Her paper was rejected because she lacked determination.", "The rejection neither encouraged nor discouraged the young scientist."], "Far from discouraging = לא רק שלא ייאש, אלא חיזק. resolve = נחישות."],
  [5, "No sooner had the new law been passed than its unintended consequences began to emerge.", "The law's unexpected effects started to appear right after it was passed.", ["The law was passed in order to produce these consequences.", "Its consequences appeared long before the law was passed.", "The law was passed only after its consequences were understood."], "No sooner … than = מיד אחרי. unintended = לא מכוונות, ולכן התשובה הראשונה נפסלת."],
  [5, "It would be a mistake to conclude from the study that exercise has no effect on memory.", "The study should not be taken as proof that exercise does not influence memory.", ["The study proves that exercise has no effect on memory.", "It would be a mistake to exercise in order to improve memory.", "The study shows that exercise greatly improves memory."], "הטעות היא להסיק שאין השפעה. המחקר לא מוכיח שאין, וגם לא מוכיח שיש השפעה גדולה."],
  [5, "That the experiment succeeded at all was due less to careful planning than to sheer luck.", "The experiment's success owed more to chance than to good preparation.", ["The experiment succeeded because it had been planned carefully.", "Careful planning and luck contributed equally to the experiment's success.", "Despite good luck, the experiment failed because of poor planning."], "due less to X than to Y = יותר בגלל Y. sheer luck = מזל גרידא."],
  [5, "Seldom, if ever, has a single invention transformed daily life as rapidly as the smartphone.", "Probably no other invention has changed everyday life as quickly as the smartphone.", ["Many inventions have changed daily life faster than the smartphone.", "The smartphone changed daily life slowly, like most inventions.", "The smartphone is the only invention that has ever changed daily life."], "Seldom, if ever = לעיתים רחוקות, אם בכלל. כמעט אין המצאה שעשתה זאת מהר כל כך."],
];

type PracticePassage = { id: string; title: string; paragraphs: string[]; items: Item[] };

const passageItems: PracticePassage[] = [
  {
    id: "pp1",
    title: "The Psychology of Waiting",
    paragraphs: [
      "Few everyday experiences are as widely disliked as waiting in line. Yet researchers who study queues have found that how long we wait matters less than how the wait feels. In one often-cited case, passengers at an airport complained constantly about the time it took to collect their luggage. Rather than hiring more staff, the airport moved the arrival gates farther from the baggage area, so that passengers spent most of the time walking instead of standing still. Complaints dropped sharply, even though the total time had not changed.",
      "Several principles help explain this effect. Unoccupied time feels longer than occupied time, which is why many waiting areas offer mirrors, screens or something to read. Uncertain waits feel longer than known ones: a sign announcing a twenty-minute delay is easier to bear than no information at all. Perhaps most importantly, unfair waits feel longer than fair ones. People who see someone who arrived later being served first often become angrier than the delay itself would justify.",
      "For this reason, many banks and post offices have replaced several separate lines with a single line that feeds all the counters. A single line is not necessarily faster on average, but it guarantees that customers are served in the order in which they arrived, and it removes the frustration of watching the neighboring line move more quickly.",
    ],
    items: [
      [3, "What is the main point of the passage?", "How people experience a wait can matter more than its actual length.", ["Airports should hire more staff to reduce waiting times.", "Single lines are always faster than several separate lines.", "Most people do not mind waiting if the wait is short."], "how long we wait matters less than how the wait feels: זה המשפט המרכזי, ושאר הקטע מדגים אותו."],
      [3, "According to paragraph 1, why did complaints at the airport drop?", "Passengers spent the waiting time walking rather than standing.", ["The luggage arrived more quickly than before.", "The airport hired more staff to handle baggage.", "Passengers were given something to read while they waited."], "the total time had not changed: הזמן לא התקצר, רק עבר בהליכה.", 1],
      [3, "The mirrors and screens mentioned in paragraph 2 are examples of ways to", "make waiting time feel occupied", ["tell customers how long they will wait", "make sure people are served in order", "reduce the actual length of the wait"], "Unoccupied time feels longer … which is why … mirrors, screens: נותנים לזמן תעסוקה.", 2],
      [4, "According to paragraph 2, which of the following would probably cause the most anger?", "Seeing a customer who arrived later being served first", ["Waiting twenty minutes after being told about the delay", "Waiting in a room with screens and magazines", "Walking a long way to collect luggage"], "Perhaps most importantly, unfair waits: המתנה לא הוגנת מכעיסה יותר מכל השאר.", 2],
      [3, "According to paragraph 3, the main advantage of a single line is that it", "ensures that customers are served in the order they arrived", ["always reduces the average waiting time", "requires fewer counters to be open", "allows customers to choose the fastest counter"], "not necessarily faster … but it guarantees … the order: היתרון הוא הוגנות, לא מהירות.", 3],
    ],
  },
  {
    id: "pp2",
    title: "The Ten Percent Myth",
    paragraphs: [
      "Few claims about the human brain are as widely repeated as the idea that we use only ten percent of it. The notion appears in advertisements, self-help books and films, usually accompanied by the promise that the remaining ninety percent can be unlocked with the right technique. Neuroscientists, however, have long regarded the claim as baseless. Brain-imaging studies show activity throughout the brain over the course of a day, and damage to almost any region, however small, produces some measurable effect.",
      "The origins of the myth are difficult to trace. Some historians point to early twentieth-century psychologists who remarked, loosely, that most people fail to reach their full mental potential, a statement about effort and opportunity, not about anatomy. Others suggest that early studies, in which stimulating large areas of the brain produced no visible response, were misread as evidence that those areas did nothing at all.",
      "Why has the claim survived so long despite repeated refutation? One explanation is that it is flattering: it implies that each of us possesses vast untapped abilities. Another is that it is useful to those who sell products promising to release them. The myth's persistence is, in this sense, less a puzzle about science than a lesson about what people want to believe.",
    ],
    items: [
      [4, "The author's main purpose in the passage is to", "explain why a popular belief about the brain is false and why it persists", ["describe techniques for using more of the brain", "argue that brain-imaging studies are unreliable", "show that early psychologists understood the brain well"], "פסקה 1: למה זה לא נכון. פסקה 2: מאיפה זה בא. פסקה 3: למה זה שורד."],
      [4, "Which of the following is offered in paragraph 1 as evidence against the claim?", "Damage to even a small part of the brain usually has an effect.", ["Most people fail to reach their full mental potential.", "Advertisements often repeat the claim.", "Stimulating some brain areas produces no visible response."], "damage to almost any region, however small, produces some measurable effect. התשובה האחרונה מפסקה 2, ובכלל לא מפריכה את הטענה.", 1],
      [4, "According to paragraph 2, the early psychologists' remark was", "about how much of their potential people use, not about the brain's structure", ["based on careful studies of brain anatomy", "intended to promote self-help products", "proof that most of the brain is inactive"], "a statement about effort and opportunity, not about anatomy.", 2],
      [5, "It can be inferred from paragraph 2 that the early stimulation studies were misread because researchers", "assumed that no visible response meant no function", ["stimulated too small an area of the brain", "deliberately hid their results", "used modern brain-imaging techniques"], "no visible response … misread as evidence that those areas did nothing: מ\"אין תגובה נראית\" הסיקו \"אין תפקיד\".", 2],
      [4, "In the last sentence, the author suggests that the myth survives mainly because", "it appeals to people's wishes rather than to evidence", ["scientists have not yet refuted it", "it has never been tested by experiments", "it is supported by recent brain-imaging studies"], "less a puzzle about science than a lesson about what people want to believe.", 3],
    ],
  },
  {
    id: "pp3",
    title: "When a Measure Becomes a Target",
    paragraphs: [
      "In the 1970s, the economist Charles Goodhart observed that a statistical measure used to guide policy tends to lose its usefulness once people know they are being judged by it. His observation, usually paraphrased as \"when a measure becomes a target, it ceases to be a good measure,\" has since been extended far beyond economics. Hospitals evaluated on waiting times, schools judged by test scores and police departments ranked by arrest rates have all, at various times, been accused of improving their numbers rather than the things the numbers were meant to reflect.",
      "The mechanism is not necessarily dishonest. A teacher who devotes more class time to the format of a standardized test is responding rationally to the incentives she faces, and may sincerely believe she is helping her students. The difficulty is that a measure captures only part of what matters; once effort is redirected toward that part, the remainder is neglected, and the measure ends up describing an increasingly narrow slice of reality.",
      "None of this implies that measurement should be abandoned. Without data, institutions would be left to rely on impressions, which are at least as easily distorted. Critics of this pessimism argue instead for rotating among several indicators, keeping some of them confidential, or pairing numbers with qualitative judgment, so that no single figure can become the object of manipulation. Such remedies are imperfect, but they acknowledge what the original observation implies: that a number is most informative when no one is trying to move it.",
    ],
    items: [
      [5, "Which of the following best expresses the main idea of the passage?", "Measures used as targets tend to become less reliable, but the answer is to use them more carefully rather than to abandon them.", ["Statistical measures are useless and should be replaced by personal impressions.", "Teachers and doctors deliberately falsify their results to meet targets.", "Goodhart's observation applies only to economic policy."], "פסקה 3: None of this implies that measurement should be abandoned. הבעיה אמיתית, והפתרון זהירות ולא ויתור."],
      [4, "The examples of hospitals, schools and police departments in paragraph 1 are given in order to", "show that Goodhart's observation applies outside economics", ["prove that these institutions are dishonest", "compare the quality of different public services", "argue that waiting times are the best measure of hospital quality"], "has since been extended far beyond economics: הדוגמאות באות מיד אחרי המשפט הזה.", 1],
      [5, "According to paragraph 2, a measure \"ends up describing an increasingly narrow slice of reality\" because", "effort shifts toward what is measured, and what is not measured receives less attention", ["people deliberately report false numbers", "the measure is changed every year", "institutions stop collecting data altogether"], "once effort is redirected toward that part, the remainder is neglected. ובפסקה כתוב במפורש: not necessarily dishonest.", 2],
      [5, "Which of the following would the critics mentioned in paragraph 3 most likely recommend?", "Judging a school by several indicators, some of which are not announced in advance", ["Judging a school only by its students' test scores", "Replacing all school statistics with the head teacher's impressions", "Publishing every indicator so that schools can improve them"], "rotating among several indicators, keeping some of them confidential: כמה מדדים, וחלקם בסוד.", 3],
      [5, "The phrase \"a number is most informative when no one is trying to move it\" suggests that", "a measure is most accurate when people are not acting to change it", ["numbers should never change from year to year", "only fixed numbers can be trusted by institutions", "people should be prevented from collecting data"], "move it = להזיז את המספר בכוונה. מדד מדויק ביותר כשאף אחד לא מנסה לשפר אותו עצמו.", 3],
    ],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const levels: Record<string, Level> = {};

function make(type: "sentence" | "restatement" | "reading", items: Item[], idOf: (i: number) => string, passageId = "") {
  return items.map(([level, stem, correct, wrong, why, paragraph], i) => {
    const id = idOf(i);
    levels[id] = level;
    return toQuestion(id, type, [stem, correct, wrong, why, paragraph], passageId);
  });
}

export const hardPracticeQuestions: Question[] = [
  ...make("sentence", sentence, (i) => `ph-sc-${pad(i + 1)}`),
  ...make("restatement", restatement, (i) => `ph-rs-${pad(i + 1)}`),
  ...passageItems.flatMap((p) => make("reading", p.items, (i) => `ph-rc-${p.id}-${i + 1}`, p.id)),
];

export const hardPracticePassages: Passage[] = passageItems.map(({ id, title, paragraphs }) => ({ id, title, paragraphs }));

export const practiceLevels: Record<string, Level> = levels;
