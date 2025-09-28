export const isProductionEnvironment = process.env.NODE_ENV === "production";

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const SESSION_TEMPLATES = [
  {
    id: 0,
    title: "Preliminary call",
    description:
      "The coach will get to know you, understand your concerns, and explain the journey ahead.",
    icon: "Rocket",
    forms: [
      {
        id: "demographics-details",
        title: "Demographics Details",
        description: "Tell us about yourself and your career aspirations",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/0/q/demographics-details",
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/0/schedule",
        prerequisites: ["demographics-details"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["demographics-details"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/0/feedback",
        // route: "/session-feedback?session=0",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["demographics-details"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/0/report",
      },
    ],
    status: "locked",
    topics: ["Demographics Details"],
  },
  {
    id: 1,
    title: "Identity Discovery",
    description:
      "The coach will help you identify your values and set a clear goal.",
    icon: "Lightbulb",
    forms: [
      {
        id: "pre-assessment",
        title: "Base-line Assessment",
        description:
          "To understand your current levels of confidence, openness to change and clarity on goals",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/1/q/pre-assessment",
      },
      {
        id: "career-maturity",
        title: "Career Maturity Assessment-1",
        description:
          "To understand your readiness for decision-making, how you explore options and plan ahead",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/1/q/career-maturity",
        // prerequisites: ["pre-assessment"],
      },
      {
        id: "psychological-wellbeing",
        title: "Wellbeing Assessment-1",
        description:
          "To understand your well-being in areas like relationships, growth, and sense of purpose",
        status: "not started",
        icon: "Activity",
        route: "/journey/sessions/1/q/psychological-wellbeing",
        // prerequisites: ["career-maturity"],
      },
      {
        id: "pre-coaching-strength-difficulty",
        title: "Strengths & Difficulties Assessment-1",
        description:
          "To understand your strengths and challenges in emotions, behavior, and relationships",
        status: "not started",
        icon: "Activity",
        route: "/journey/sessions/1/q/pre-coaching-strength-difficulty",
        // prerequisites: ["career-maturity"],
      },
      {
        id: "career-story-1",
        title: "My Story-1 Activity",
        description:
          "To reflect on your life, your role models and values and learn more about yourself",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/1/a/career-story-1",
        // prerequisites: ["pre-assessment", "career-maturity"],
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/1/schedule",
        prerequisites: [
          "pre-assessment",
          "career-maturity",
          "psychological-wellbeing",
          "pre-coaching-strength-difficulty",
          "career-story-1",
        ],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["pre-assessment", "career-maturity", "career-story-1"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/1/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["pre-assessment", "career-maturity", "career-story-1"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/1/report",
      },
    ],
    status: "locked",
    topics: [
      "Base-line Assessment",
      "Career Maturity Assessment-1",
      "Wellbeing Assessment-1",
      "Strengths & Difficulties Assessment-1",
      "My Story-1 Activity",
    ],
  },
  {
    id: 2,
    title: "Exploring Reality",
    description:
      "The coach will help you recognize the challenges blocking your goals.",
    icon: "Star",
    forms: [
      {
        id: "riasec-test",
        title: "Interest Assessment",
        description:
          "To understand your interests and help you explore suitable career paths",
        status: "not-completed",
        icon: "Compass",
        route: "/journey/sessions/2/q/riasec-test",
      },
      {
        id: "personality-test",
        title: "Personality Assessment",
        description:
          "To understand your personality and help you know yourself better",
        status: "not-completed",
        icon: "Smile",
        route: "/journey/sessions/2/q/personality-test",
        // prerequisites: ["riasec-test"],
      },
      {
        id: "life-collage",
        title: "My Life Collage Activity",
        description:
          "To understand where you are in life, where you want to go, and the challenges you're facing",
        status: "not-completed",
        icon: "Image",
        route: "/journey/sessions/2/a/life-collage",
        // prerequisites: ["riasec-test", "personality-test"],
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/2/schedule",
        prerequisites: ["riasec-test", "personality-test", "life-collage"],
      },

      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["riasec-test", "personality-test", "life-collage"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/2/feedback",
      },

      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["riasec-test", "personality-test", "life-collage"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/2/report",
      },
    ],
    status: "locked",
    topics: [
      "Interest Assessment",
      "Personality Assessment",
      "Life Collage Activity",
    ],
  },
  {
    id: 3,
    title: "Change in the View",
    description:
      "The coach will help you identify your strengths and enhance your clarity on utilizing them effectively.",
    icon: "HeartPulse",
    forms: [
      {
        id: "career-story-2",
        title: "My Story-2 Activity",
        description:
          "To understand who you are, who you’re becoming, the settings you enjoy, and your interests",
        status: "not started",
        icon: "Book",
        route: "/journey/sessions/3/a/career-story-2",
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/3/schedule",
        prerequisites: ["career-story-2"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-2"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/3/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-2"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/3/report",
      },
    ],
    status: "locked",
    topics: ["My Story-2 Activity"],
  },
  {
    id: 4,
    title: "Visualizing Pathways-1",
    description:
      "The coach will guide you in exploring and listing your options.",
    icon: "Target",
    forms: [
      {
        id: "career-story-3",
        title: "My Story-3 Activity",
        description:
          "To make a summary portrait of who you are, what you value, and what drives your decisions",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/4/a/career-story-3",
      },
      {
        id: "letter-from-future-self",
        title: "Letter From Future Activity",
        description:
          "To reflect on your goals by writing a letter from your future self to your current self",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/4/a/letter-from-future-self",
        // prerequisites: ["career-story-3"],
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/4/schedule",
        prerequisites: ["career-story-3", "letter-from-future-self"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-3", "letter-from-future-self"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/4/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-3", "letter-from-future-self"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/4/report",
      },
    ],
    status: "locked",
    topics: ["My Story-3 Activity", "Letter From Future Activity"],
  },
  {
    id: 5,
    title: "Visualizing Pathways-2",
    description:
      "The coach will support you in evaluating options based on what matters most to you.",
    icon: "Users",
    forms: [
      {
        id: "career-option-matrix",
        title: "Matrix Activity",
        description:
          "To guide you in evaluating your options based on what is most important and relevant for you",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/5/a/career-option-matrix",
      },
      {
        id: "career-story-4",
        title: "My Story-4 Activity",
        description: "To reflect on your story as well as the progress made",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/5/a/career-story-4",
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/5/schedule",
        prerequisites: ["career-option-matrix", "career-story-4"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-4"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/5/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-4"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/5/report",
      },
    ],
    status: "locked",
    topics: ["Matrix Activity", "My Story-4 Activity"],
  },
  {
    id: 6,
    title: "Visualizing Pathways-3",
    description: "The coach will guide you to finalize the best path forward.",
    icon: "FileText",
    forms: [
      {
        id: "career-story-5",
        title: "My Story-5 Activity",
        description:
          "A Storyboard to create a roadmap of the steps to reach your goal",
        status: "not started",
        icon: "Book",
        route: "/journey/sessions/6/a/career-story-5",
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/6/schedule",
        prerequisites: ["career-story-5"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-5"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/6/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-5"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/6/report",
      },
    ],
    status: "locked",
    topics: ["My Story-5 Activity"],
  },
  {
    id: 7,
    title: "Actioning Change",
    description:
      "The coach will guide you to create a step-by-step action plan towards your goal, prepare for challenges, and build strategies.",
    icon: "MessageSquare",
    forms: [
      {
        id: "career-story-6",
        title: "My Story-5 Activity [Final]",
        description:
          "To finalize the Storyboard with the roadmap of your next steps to reach your goal",
        status: "not started",
        icon: "Book",
        route: "/journey/sessions/7/a/career-story-6",
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/7/schedule",
        prerequisites: ["career-story-6"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-6"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/7/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-6"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/7/report",
      },
    ],
    status: "locked",
    topics: ["My Story-5 Activity [Final]"],
  },
  {
    id: 8,
    title: "Check-in for Sustenance",
    description:
      "The coach will check in with you to review progress, identify gaps, and provide support.",
    icon: "Search",
    forms: [
      {
        id: "daily-journaling",
        title: "Daily Journal",
        description:
          "To reflect on your daily progress, identify challenges, and practice gratitude",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/8/a/daily-journaling",
      },
      {
        id: "post-coaching",
        title: "Finish-line Assessment",
        description:
          "To understand your confidence and clarity on goals as well as your wellbeing as you complete the Self-Discovery Journey",
        status: "not-completed",
        icon: "Activity",
        route: "/journey/sessions/8/q/post-coaching",
        // prerequisites: ["daily-journaling"],
      },
      {
        id: "post-career-maturity",
        title: "Career Maturity Assessment-2",
        description:
          "To understand your readiness for decision-making, how you explore options and plan ahead",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/8/q/post-career-maturity",
        // prerequisites: ["daily-journaling", "post-coaching"],
      },
      {
        id: "post-psychological-wellbeing",
        title: "Wellbeing Assessment-2",
        description:
          "To understand your well-being in areas like relationships, growth, and sense of purpose",
        status: "not-completed",
        icon: "Activity",
        route: "/journey/sessions/8/q/post-psychological-wellbeing",
        // prerequisites: ["daily-journaling", "post-coaching", "post-career-maturity"],
      },
      {
        id: "post-strength-difficulty",
        title: "Strengths & Difficulties Assessment-2",
        description:
          "To understand your strengths and challenges in emotions, behavior, and relationships",
        status: "not-completed",
        icon: "Activity",
        route: "/journey/sessions/8/q/post-strength-difficulty",
        // prerequisites: ["daily-journaling", "post-coaching", "post-career-maturity", "post-psychological-wellbeing"],
      },
      {
        id: "schedule-call",
        title: "Book a Session",
        description:
          "Book a personalized coaching session to meet your coach, discuss your concerns, and begin your journey",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/8/schedule",
        prerequisites: ["daily-journaling"],
      },
      {
        id: "session-feedback",
        title: "Share Feedback",
        description: "Tell us what you thought about your session",
        prerequisites: ["schedule-call"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/8/feedback",
      },
      {
        id: "session-report",
        title: "Session Summary",
        description:
          "Receive a comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/8/report",
      },
    ],
    status: "locked",
    topics: [
      "Daily Journal",
      "Finish-line Assessment",
      "Career Maturity Assessment-2",
      "Wellbeing Assessment-2",
      "Strengths & Difficulties Assessment-2",
    ],
  },
];
