const GRACE_DIMENSIONS = [
  {
    id: "emotional",
    name: "Emotional",
    sub: "Mind and inner state",
    color: "#9c72c8",
    intro: "How you process stress, emotions, and mental weight.",
    tools: ["AI Recovery Companion", "AI Peer Support Chat", "Journaling Prompts", "Mood Tracking"]
  },
  {
    id: "financial",
    name: "Financial",
    sub: "Money and stability",
    color: "#d4ac5a",
    intro: "Budgeting, debt, planning, and financial peace of mind.",
    tools: ["Credit Repair Tool", "Budget Planner", "Financial Goal Tracker", "Debt Payoff Calculator"]
  },
  {
    id: "occupational",
    name: "Occupational",
    sub: "Work and direction",
    color: "#4db6ac",
    intro: "Skills, purpose, career direction, and work-life alignment.",
    tools: ["AI Skill Builder", "Career Path Planner", "Resume Generator", "Entrepreneur Simulator"]
  },
  {
    id: "social",
    name: "Social",
    sub: "Support and relationships",
    color: "#e57373",
    intro: "Connection, support systems, accountability, and boundaries.",
    tools: ["AI Community Builder", "Group Challenges", "Accountability Circles", "Peer Support Platform"]
  },
  {
    id: "intellectual",
    name: "Intellectual",
    sub: "Growth and learning",
    color: "#81c784",
    intro: "Curiosity, learning, ideas, expansion, and mental stimulation.",
    tools: ["Learning Tracker", "Curiosity Prompts", "Book Club Discussions", "AI Personal Story Builder"]
  },
  {
    id: "spiritual",
    name: "Spiritual",
    sub: "Meaning and purpose",
    color: "#b39ddb",
    intro: "Purpose, gratitude, reflection, and inner alignment.",
    tools: ["Reflection Prompts", "Gratitude System", "Purpose Exploration", "AI Decision Coach"]
  },
  {
    id: "physical",
    name: "Physical",
    sub: "Body and routine",
    color: "#c2185b",
    intro: "Movement, sleep, energy, habits, and daily wellness.",
    tools: ["Habit Tracker", "Wellness Challenges", "Routine Builder", "Wellness Tracking"]
  },
  {
    id: "environmental",
    name: "Environmental",
    sub: "Space and surroundings",
    color: "#ffb74d",
    intro: "Home, routine, organization, and supportive environments.",
    tools: ["Home Organization Tools", "Lifestyle Planning", "Living Situation Tracker", "Environment Reset"]
  }
];

const GUIDE_CHAPTERS = [
  {
    id: "intro",
    title: "Introduction",
    text: `This guide is about what actually helped me. Not what I was told should help me. What actually worked.

This platform grows from that same idea. Start where you are. Check in honestly. Focus on one real step.`
  },
  {
    id: "happiness",
    title: "Chapter 1 – What Does Happiness Mean to You",
    text: `What does happiness actually mean to you?

Not the version you see online.
Not what people tell you it should look like.

Maybe it is laughing so hard your stomach hurts.
Maybe it is waking up and not immediately dreading the day.
Maybe it is simply feeling okay.

Ask yourself:
- What genuinely makes me happy?
- What is working against me right now?
- What is one small thing I could do today that might help?`
  },
  {
    id: "lifeworks",
    title: "Chapter 2 – Building a Life That Actually Works",
    text: `Start with the basics.
Ask whether your basic needs are being met.
Do you feel safe?
Are you resting?
Are the people around you supportive or draining?

Then build from there:
- What brings you joy?
- What is draining you?
- Who supports you?
- Where do you need rest?
- What small area can you improve this month?`
  },
  {
    id: "selfcare",
    title: "Chapter 4 – Self-Care Is Not a Luxury",
    text: `Real self-care is not about fancy routines.
It is about maintaining yourself so you can keep going.

Start with:
- mindset
- body
- emotions
- what you let into your mind
- the people around you
- what gives you meaning`
  },
  {
    id: "smallwins",
    title: "Chapter 5 – The Power of Small Wins",
    text: `Real change rarely happens all at once.
Most of the time, it happens slowly.

Small steps.
Small actions.
Small wins.

Small wins create momentum.
Momentum creates change.`
  },
  {
    id: "dimensions",
    title: "Chapter 7 – The 8 Dimensions of Wellness",
    text: `Wellness is broader than physical health.
Your life is influenced by many different parts that affect each other.

The 8 Dimensions of Wellness are:
- Emotional
- Physical
- Social
- Financial
- Spiritual
- Occupational
- Intellectual
- Environmental

The goal is not perfection.
The goal is awareness and balance.`
  },
  {
    id: "community",
    title: "Chapter 8 – You Don’t Have to Do This Alone",
    text: `Community is not extra.
Connection matters.

The right support can remind you who you are, encourage you when things get difficult, and help you keep going.`
  },
  {
    id: "future",
    title: "Chapter 11 – Designing the Future You Want",
    text: `The future is shaped one decision at a time.

You do not need a perfect plan.
You need direction, intention, and small actions repeated over time.`
  }
];

const TOOL_SECTIONS = [
  {
    title: "Emotional / Mental",
    items: ["AI Recovery Companion", "AI Peer Support Chat", "Journaling Prompts", "Mood Tracking", "AI Decision Coach"]
  },
  {
    title: "Financial",
    items: ["Credit Repair Tool", "Budgeting Planner", "Financial Goal Tracker", "Debt Payoff Calculator"]
  },
  {
    title: "Occupational",
    items: ["AI Skill Builder", "Career Path Planner", "Resume Generator", "Entrepreneur Simulator"]
  },
  {
    title: "Social",
    items: ["AI Community Builder", "Group Challenges", "Accountability Circles", "AI Peer Support Platform"]
  },
  {
    title: "Intellectual",
    items: ["Learning Tracker", "Curiosity Prompts", "Book Club Discussions", "AI Personal Story Builder"]
  },
  {
    title: "Spiritual",
    items: ["Reflection Prompts", "Gratitude System", "Purpose Exploration"]
  },
  {
    title: "Physical",
    items: ["Habit Tracker", "Wellness Challenges", "Routine Builder"]
  },
  {
    title: "Environmental",
    items: ["Home Organization Tools", "Lifestyle Planning", "Living Situation Tracker"]
  }
];

const MEMBERSHIP_LEVELS = [
  {
    name: "Free",
    price: "$0",
    desc: "Start your wellness check-ins, explore the 8 dimensions, preview the guide, and begin using G.R.A.C.E.",
    items: ["8 Dimensions tracker", "AI coach preview", "Guide preview", "Journal preview", "Games preview"]
  },
  {
    name: "Grow",
    price: "$19/mo",
    desc: "For people who want deeper reflection, more structure, and more tools.",
    items: ["Full journal space", "Guide reader access", "Prompt decks", "Expanded trackers", "Premium reflections"]
  },
  {
    name: "Build",
    price: "$49/mo",
    desc: "For users building stronger systems, routines, and life direction.",
    items: ["Advanced AI tools", "Programs and workbooks", "Life Rebuilder access", "Deep planning tools", "Workshops"]
  },
  {
    name: "Elevate",
    price: "$149/mo",
    desc: "For people, groups, and organizations ready for premium support and experiences.",
    items: ["Coaching and strategy", "Speaking / workshops", "Programs", "Partnerships", "Retreats / branded experiences"]
  }
];
