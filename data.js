const GRACE_DIMENSIONS = [
  {
    id: "emotional",
    name: "Emotional",
    sub: "Mind and inner state",
    color: "#9c72c8",
    intro: "How you process stress, emotions, and mental weight.",
    tools: ["Support Companion", "Talk to G.R.A.C.E.", "Journaling Prompts", "Mood Tracking"]
  },
  {
    id: "financial",
    name: "Financial",
    sub: "Money and stability",
    color: "#d4ac5a",
    intro: "Budgeting, debt, planning, and financial peace of mind.",
    tools: ["Credit Builder", "Budget Planner", "Financial Goal Tracker", "Debt Payoff Calculator"]
  },
  {
    id: "occupational",
    name: "Occupational",
    sub: "Work and direction",
    color: "#4db6ac",
    intro: "Skills, purpose, career direction, and work-life alignment.",
    tools: ["Skill Builder", "Career Path Planner", "Resume Builder", "Business Builder"]
  },
  {
    id: "social",
    name: "Social",
    sub: "Support and relationships",
    color: "#e57373",
    intro: "Connection, support systems, accountability, and boundaries.",
    tools: ["Connection Builder", "Group Challenges", "Accountability Circles", "Peer Support"]
  },
  {
    id: "intellectual",
    name: "Intellectual",
    sub: "Growth and learning",
    color: "#81c784",
    intro: "Curiosity, learning, ideas, expansion, and mental stimulation.",
    tools: ["Learning Tracker", "Curiosity Prompts", "Book Club Discussions", "Personal Story Builder"]
  },
  {
    id: "spiritual",
    name: "Spiritual",
    sub: "Meaning and purpose",
    color: "#b39ddb",
    intro: "Purpose, gratitude, reflection, and inner alignment.",
    tools: ["Reflection Prompts", "Gratitude Practice", "Purpose Exploration", "Decision Guide"]
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
    tools: ["Home Organization Tools", "Lifestyle Planning", "Housing Check-In", "Environment Reset"]
  }
];

const GUIDE_CHAPTERS = [
  {
    id: "intro",
    title: "Introduction",
    text: `This guide is about what actually helped me. Not what I was told should help me. What actually worked.

Everything is connected.
This guide is built around that idea. Instead of focusing on just one problem, we are going to look at your life as a whole and figure out what areas might need attention.

Start where you are.
Check in.
Focus on one area.
Keep going.`
  },
  {
    id: "happiness",
    title: "What Does Happiness Mean to You?",
    text: `Let’s start with a real question. What does happiness actually mean to you?

Not the version you see online.
Not what people tell you it should look like.
What does it actually feel like in your life?

Maybe it is laughing so hard your stomach hurts.
Maybe it is waking up and not immediately dreading the day.
Maybe it is simply feeling okay.

One thing this guide comes back to is that happiness is not the same for everyone. The work is figuring out what actually works in your life.

Before moving on, ask yourself:
- What genuinely makes me happy?
- What feels like it is working against me right now?
- What is one small thing I could do today that might help?`
  },
  {
    id: "lifeworks",
    title: "Building a Life That Actually Works",
    text: `This chapter is about the practical side of happiness. Not the theory. The actual things you can start doing to build a life that feels more stable, more connected, and more like your own.

Start with the basics:
- Do you feel safe?
- Are your basic needs being met?
- Are the people around you supportive or draining?

Then build from there:
- What brings you joy?
- What is draining you?
- Who supports you?
- Where do you need rest?
- What small area can you improve this month?`
  },
  {
    id: "feels-like-you",
    title: "Living in a Way That Actually Feels Like You",
    text: `A lot of people spend years living in ways that do not actually feel aligned with who they are.

Sometimes that happens because of pressure.
Sometimes survival mode takes over.
Sometimes people get so used to pushing through that they stop checking in with themselves.

This chapter is about noticing where your life feels out of alignment and asking what needs to shift.

Ask yourself:
- What parts of my life feel like me?
- What parts feel forced, heavy, or disconnected?
- What would it look like to live in a way that feels more true to who I am?`
  },
  {
    id: "selfcare",
    title: "Self-Care Is Not a Luxury",
    text: `Real self-care is not about fancy routines.
It is about maintaining yourself so you can keep going.

Start with:
- mindset
- body
- emotions
- what you let into your mind
- the people around you
- what gives you meaning

Taking care of yourself is not selfish.
It is part of being able to show up for your life.`
  },
  {
    id: "smallwins",
    title: "The Power of Small Wins",
    text: `A lot of people focus on big changes.
But real change rarely happens all at once.

Most of the time it happens slowly:
- one decision at a time
- one small action at a time
- one repeated habit at a time

Small wins create momentum.
Momentum builds confidence.
Confidence helps people keep going.

If a goal feels overwhelming, focus on the next small action instead of the whole mountain.`
  },
  {
    id: "nourish",
    title: "Nourishing Your Body and Mind",
    text: `Your body and your mind affect each other more than people sometimes realize.

When you are exhausted, underfed, overstimulated, or carrying too much stress, everything feels heavier.
The goal is not perfection.
The goal is paying attention to what supports you and what throws you off.

Start with simple questions:
- Am I sleeping enough?
- Am I eating in a way that supports me?
- Am I carrying too much stress without release?
- What helps me feel more steady?`
  },
  {
    id: "dimensions",
    title: "The 8 Dimensions of Wellness",
    text: `Wellness is broader than physical health.

Your life is influenced by many different parts that affect each other:
- Emotional
- Physical
- Social
- Financial
- Spiritual
- Occupational
- Intellectual
- Environmental

The goal is not perfection.
The goal is awareness and balance.

When one area is struggling, it often affects the others.`
  },
  {
    id: "community",
    title: "You Don’t Have to Do This Alone",
    text: `Community is not extra.
Connection matters.

The right support can remind you who you are, encourage you when things get difficult, and help you keep going.

You do not need to do every part of life alone.
Support can make rebuilding feel more possible.`
  },
  {
    id: "reset",
    title: "Stepping Away to Reset Your Mind",
    text: `Sometimes the most helpful thing is stepping back long enough to breathe, reset, and think clearly.

That does not always mean a huge break.
Sometimes it means:
- putting the phone down
- taking a walk
- sitting in quiet
- creating a little distance from what is overwhelming you

Resetting your mind helps you come back with more clarity.`
  },
  {
    id: "adapt",
    title: "Learning to Adapt When Life Changes",
    text: `Life changes.
Plans shift.
Things do not always go the way we hoped.

Being flexible does not mean you stop caring about your goals.
It means you are willing to adjust your path when necessary.

Instead of asking only what went wrong, it can help to ask:
- What can this teach me?
- What can I do next?
- How do I keep moving without giving up on myself?`
  },
  {
    id: "future",
    title: "Designing the Future You Want",
    text: `The future does not just appear one day fully formed.
Most of the time it grows out of small decisions you make every day.

You do not need a perfect plan.
You need direction, intention, and repeated action.

Start with:
- what matters to you
- what you want to improve or build
- what one small step you can take now

Small steps repeated over time create something meaningful.`
  },
  {
    id: "purpose-impact",
    title: "Living With Purpose and Creating Impact",
    text: `A meaningful life is not defined only by achievements.

It is shaped by:
- growth
- relationships
- purpose
- the way you show up for others

Your story matters.
Your growth matters.
The way you live can create ripple effects for other people too.

The ideas in this guide are tools you can return to whenever you need them.`
  },
  {
    id: "about-grace",
    title: "About G.R.A.C.E.",
    text: `G.R.A.C.E. did not start as an organization. It started as a realization.

After going through some of the hardest moments in life, it became clear how many people feel like they are navigating their struggles alone. Mental health challenges, personal setbacks, and life transitions can leave people feeling disconnected and unsure of where to turn.

That idea became G.R.A.C.E. — Get Right And Conquer Everything.

G.R.A.C.E. was created to help people rebuild, learn, and support each other without judgment. Its mission is to help people grow, set goals, and rebuild their lives through the 8 Dimensions of Wellness.

This guide is an invitation to take that first step.`
  }
];

const TOOL_SECTIONS = [
  {
    title: "Emotional / Mental",
    items: ["Support Companion", "Talk to G.R.A.C.E.", "Journaling Prompts", "Mood Tracking", "Decision Guide"]
  },
  {
    title: "Financial",
    items: ["Credit Builder", "Budget Planner", "Financial Goal Tracker", "Debt Payoff Calculator"]
  },
  {
    title: "Occupational",
    items: ["Skill Builder", "Career Path Planner", "Resume Builder", "Business Builder"]
  },
  {
    title: "Social",
    items: ["Connection Builder", "Group Challenges", "Accountability Circles", "Peer Support"]
  },
  {
    title: "Intellectual",
    items: ["Learning Tracker", "Curiosity Prompts", "Book Club Discussions", "Personal Story Builder"]
  },
  {
    title: "Spiritual",
    items: ["Reflection Prompts", "Gratitude Practice", "Purpose Exploration", "Decision Guide"]
  },
  {
    title: "Physical",
    items: ["Habit Tracker", "Wellness Challenges", "Routine Builder", "Wellness Tracking"]
  },
  {
    title: "Environmental",
    items: ["Home Organization Tools", "Lifestyle Planning", "Housing Check-In", "Environment Reset"]
  }
];

const MEMBERSHIP_LEVELS = [
  {
    name: "Free",
    price: "$0",
    desc: "Explore the basics of G.R.A.C.E. and begin your wellness check-ins.",
    items: ["8 Dimensions tracker", "G.R.A.C.E. Tools preview", "Guide preview", "Journal preview", "Interactive tools preview"]
  },
  {
    name: "Grow",
    price: "$19/mo",
    desc: "For more guided reflection, planning, and personal support tools.",
    items: ["Full journal space", "Guide reader access", "Prompt decks", "Expanded trackers", "Reflection tools"]
  },
  {
    name: "Build",
    price: "$49/mo",
    desc: "For users ready for deeper tools, structure, and growth support.",
    items: ["Deeper G.R.A.C.E. tools", "Programs and workbooks", "Interactive tools access", "Planning tools", "Workshops"]
  },
  {
    name: "Elevate",
    price: "$149/mo",
    desc: "For higher-level support, events, and collaborative opportunities.",
    items: ["Coaching and strategy", "Workshops", "Programs", "Partnerships", "Expanded experiences"]
  }
];
