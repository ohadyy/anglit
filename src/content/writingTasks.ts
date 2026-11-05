// Practice prompts for the writing task at /practice/writing. Original writing for Anglit.
// The task is typed, 12 minutes. The minimum length is the rule of this practice (the owner's
// decision); NITE does not publish one, so never present it as NITE's rule.

export const WRITING_MINUTES = 12;
export const WRITING_MIN_WORDS = 150;

export type WritingTask = {
  id: string;
  prompt: string;
  /** A model answer, a little over the minimum, for the student to compare with after submitting */
  model: string;
};

export const writingTasks: WritingTask[] = [
  {
    id: "w1",
    prompt: "Some people say that students learn better when they study in small groups. Others prefer to study alone. Which do you prefer, and why?",
    model:
      "I prefer to study alone, mainly because I can set my own pace. In a group, the discussion often moves faster or slower than I need, and I lose time on topics that I already understand. When I study alone, I can stop and repeat a difficult page as many times as I want, and nobody is waiting for me.\n\nAnother reason is concentration. In a group, it is easy to start talking about other things, and an hour of studying can turn into half an hour of studying and half an hour of chatting. At home, with my phone away, I get much more done.\n\nOn the other hand, a group can be useful before an exam, since friends sometimes explain a subject in a way that the book does not. For this reason, I usually study alone during the week, and then meet a friend once a week to check what I learned and to ask about the parts that I did not understand.",
  },
  {
    id: "w2",
    prompt: "Do you think people should work from home more often? Explain your opinion and give at least one example.",
    model:
      "I think people should work from home at least part of the week. First, it saves time and money, because there is no need to travel to the office every day. For example, my sister used to spend two hours on the road every day, and after she started working from home she could use that time to exercise and to rest. As a result, she feels less tired and works better.\n\nSecond, many people concentrate better at home, where it is quiet and nobody interrupts them every five minutes. Companies also save money, since they need smaller offices.\n\nHowever, working at home all the time can feel lonely, and it is harder to learn from colleagues or to build a team. Some people also find it difficult to stop working at the end of the day. Therefore, I believe the best solution is a mix: two days at the office to meet colleagues and to plan together, and the rest of the week at home.",
  },
  {
    id: "w3",
    prompt: "Is it better to live in a big city or in a small town? Write about the option you would choose.",
    model:
      "I would choose to live in a big city. First of all, a city offers more jobs, more universities and more things to do after work. A small town may be quiet and friendly, but young people often have to leave it to find opportunities, so they end up in a city anyway.\n\nSecond, life in a city is more convenient in everyday ways. There are shops and clinics near every home, and public transport makes it easy to move around without a car. For example, a person who lives in Tel Aviv can get to almost any place in the country without driving.\n\nOf course, a city is more expensive, more crowded and noisier than a small town. Still, in my view these disadvantages are worth the benefits, especially for someone who is at the beginning of their career. When I am older and want a quiet life, I might move to a smaller place, but for now the city is the right choice.",
  },
  {
    id: "w4",
    prompt: "Many people use their phones for hours every day. Is this a problem? Give reasons for your answer.",
    model:
      "In my opinion, using a phone for many hours a day is a problem when it replaces other important things. First, it makes it hard to concentrate. Many people check their phones every few minutes, even during a conversation or while they study, and as a result they miss what is happening around them and need more time to finish simple tasks.\n\nSecond, sitting with a phone for hours is bad for sleep and for health. For example, many teenagers stay awake at night looking at videos, and they are tired the next day.\n\nStill, phones also have real advantages. They help us learn new things, find our way and stay in touch with family who live far away. For this reason, I do not think we should stop using them. The solution is to decide on fixed times, for example no phone during meals and none in bed. This way we keep the benefits and avoid most of the harm.",
  },
  {
    id: "w5",
    prompt: "What is the most important quality of a good teacher? Explain your choice.",
    model:
      "The most important quality of a good teacher is patience. Students learn at different speeds, and a patient teacher is willing to explain the same idea in several ways until everyone understands it. Without patience, students are afraid to ask questions, and they slowly stop trying.\n\nI remember a teacher in high school who never made me feel foolish when I made a mistake. When I did not understand something in math, she sat with me after class and showed me a different way to solve the problem. Thanks to her, I started to enjoy a subject that I used to hate, and my grades improved a lot.\n\nOf course, other qualities are important too, such as knowledge and a sense of humor. However, a teacher who knows a lot but loses patience quickly cannot help students who find the subject difficult. Knowledge is important, but patience is what makes it possible to pass that knowledge on.",
  },
  {
    id: "w6",
    prompt: "Should schools give students less homework? Write your opinion and support it.",
    model:
      "I believe schools should give less homework, but not none at all. First, students who spend the whole evening on homework have no time to rest, to exercise or to meet friends. Tired students do not learn well, and they begin to see school as a burden instead of an opportunity.\n\nSecond, a small amount of homework that is well chosen is more useful than many exercises that only repeat the same thing. For example, ten minutes of reading with a few questions can teach more than an hour of copying sentences from the board.\n\nOn the other hand, some homework is necessary, because it helps students to practice what they learned and shows the teacher who needs help. Therefore, teachers should give fewer tasks, make sure that each one has a clear purpose, and check that all the homework in a week can be done in a reasonable amount of time.",
  },
];

/** What to check in your own text before time runs out. Hebrew, since the page is in Hebrew. */
export const writingChecklist = [
  "עניתי על השאלה עצמה, ולא על נושא קרוב.",
  "כתבתי את הדעה שלי כבר בהתחלה, במשפט אחד ברור.",
  "יש לפחות שני נימוקים, ולפחות אחד מהם עם דוגמה.",
  "השתמשתי במילות קישור (however, therefore, for example, in addition).",
  "סיימתי בשורה שסוגרת את הרעיון, ולא באמצע משפט.",
  "עברתי על האיות ועל הזמנים של הפעלים.",
];

export const writingTips = [
  "אין ציון על שפה גבוהה. משפטים פשוטים וברורים עדיפים על משפט ארוך שבו טעיתם.",
  "תתחילו לכתוב אחרי חצי דקה של תכנון: דעה, שני נימוקים, דוגמה.",
  "לא יודעים מילה? תחליפו אותה במילה פשוטה שאתם כן יודעים, במקום להיתקע.",
  "השאירו דקה אחרונה לעבור על הטקסט ולתקן איות.",
];
