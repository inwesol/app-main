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
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/0/schedule",
        prerequisites: ["demographics-details"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["demographics-details"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/0/feedback",
        // route: "/session-feedback?session=0",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
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
    // duration: "30 min",
    icon: "Lightbulb",
    forms: [
      {
        id: "pre-assessment",
        title: "Pre Coaching Assessment",
        description:
          "Assess your current clarity, confidence, and readiness for your career journey.",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/1/q/pre-assessment",
      },
      {
        id: "career-maturity",
        title: "Pre Coaching Career Maturity",
        description:
          "Reflect on your attitudes, beliefs, and confidence regarding career choices and planning.",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/1/q/career-maturity",
        // prerequisites: ["pre-assessment"],
      },
      {
        id: "psychological-wellbeing",
        title: "Pre Coaching Wellbeing Assessment",
        description:
          "Evaluate aspects of your emotional health, resilience, and positive functioning. This assessment helps you recognize strengths and areas for growth in your mental wellbeing.",
        status: "not started",
        icon: "Activity",
        route: "/journey/sessions/1/q/psychological-wellbeing",
        // prerequisites: ["career-maturity"],
      },
      {
        id: "pre-coaching-strength-difficulty",
        title: "Pre Coaching Strength & Difficulty Assessment",
        description:
          "Evaluate aspects of your emotional health, resilience, and positive functioning. This assessment helps you recognize strengths and areas for growth in your mental wellbeing.",
        status: "not started",
        icon: "Activity",
        route: "/journey/sessions/1/q/pre-coaching-strength-difficulty",
        // prerequisites: ["career-maturity"],
      },
      {
        id: "career-story-1",
        title: "My Story 1",
        description:
          "Tell your unique story by describing your interests, inspirations, and envisioned career path.",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/1/a/career-story-1",
        // prerequisites: ["pre-assessment", "career-maturity"],
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
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
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["pre-assessment", "career-maturity", "career-story-1"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/1/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["pre-assessment", "career-maturity", "career-story-1"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/1/report",
      },
    ],
    status: "locked",
    topics: ["Pre Assessment", "Career Maturity", "Career Story 1"],
  },
  {
    id: 2,
    title: "Exploring Reality",
    description:
      "The coach will help you recognize the challenges blocking your goals.",
    // duration: "40 min",
    icon: "Star",
    forms: [
      {
        id: "riasec-test",
        title: "RIASEC Interest Profiler",
        description:
          "Identify your dominant career interest themes using the RIASEC model and discover which career fields best match your preferences.",
        status: "not-completed",
        icon: "Compass",
        route: "/journey/sessions/2/q/riasec-test",
      },
      {
        id: "personality-test",
        title: "Personality Profile",
        description:
          "Learn about your core traits, work styles, and how your personality influences your career preferences and relationships.",
        status: "not-completed",
        icon: "Smile",
        route: "/journey/sessions/2/q/personality-test",
        // prerequisites: ["riasec-test"],
      },
      {
        id: "life-collage",
        title: "My Life Collage",
        description:
          "Create a visual and reflective collage to express what energizes you, your values, and your dreams—bringing your unique story to life.",
        status: "not-completed",
        icon: "Image",
        route: "/journey/sessions/2/a/life-collage",
        // prerequisites: ["riasec-test", "personality-test"],
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/2/schedule",
        prerequisites: ["riasec-test", "personality-test", "life-collage"],
      },

      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["riasec-test", "personality-test", "life-collage"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/2/feedback",
      },

      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights, reflections, and progress made during the journey.",
        prerequisites: ["session-feedback"],
        // prerequisites: ["riasec-test", "personality-test", "life-collage"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/2/report",
      },
    ],
    status: "locked",
    topics: ["RIASEC Profile", "Personality Profile", "Life Collage"],
  },
  {
    id: 3,
    title: "Change in the View",
    description:
      "The coach will help you identify your strengths and enhance your clarity on utilizing them effectively.",
    // duration: "35 min",
    icon: "HeartPulse",
    forms: [
      {
        id: "career-story-2",
        title: "My Story 2",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not started",
        icon: "Book",
        route: "/journey/sessions/3/a/career-story-2",
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/3/schedule",
        prerequisites: ["psychological-wellbeing", "career-story-2"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["psychological-wellbeing", "career-story-2"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/3/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["psychological-wellbeing", "career-story-2"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/3/report",
      },
    ],
    status: "locked",
    topics: ["Wellbeing", "Career Narrative"],
  },
  {
    id: 4,
    title: "Visualizing Pathways-1",
    description:
      "The coach will guide you in exploring and listing your options.",
    // duration: "20 min",
    icon: "Target",
    forms: [
      {
        id: "career-story-3",
        title: "My Story 3",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/4/a/career-story-3",
      },
      {
        id: "letter-from-future-self",
        title: "Letter From Future Self",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/4/a/letter-from-future-self",
        // prerequisites: ["career-story-3"],
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/4/schedule",
        prerequisites: ["career-story-3", "letter-from-future-self"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-3", "letter-from-future-self"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/4/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-3", "letter-from-future-self"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/4/report",
      },
    ],
    status: "locked",
    topics: ["SMART Goals", "Career Milestones", "Action Planning"],
  },
  {
    id: 5,
    title: "Visualizing Pathways-2",
    description:
      "The coach will support you in evaluating options based on what matters most to you.",
    // duration: "35 min",
    icon: "Users",
    forms: [
      {
        id: "career-option-matrix",
        title: "Career Option Matrix",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/5/a/career-option-matrix",
      },
      {
        id: "career-story-4",
        title: "My Story 4",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/5/a/career-story-4",
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/5/schedule",
        prerequisites: ["career-option-matrix", "career-story-4"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-4"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/5/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-4"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/5/report",
      },
    ],
    status: "locked",
    topics: [
      "LinkedIn Optimization",
      "Networking Events",
      "Relationship Building",
    ],
  },
  {
    id: 6,
    title: "Visualizing Pathways-3",
    description: "The coach will guide you to finalize the best path forward.",
    // duration: "45 min",
    icon: "FileText",
    forms: [
      {
        id: "career-story-5",
        title: "My Story 5",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not started",
        icon: "Book",
        route: "/journey/sessions/6/a/career-story-5",
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/6/schedule",
        prerequisites: ["career-story-5"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-5"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/6/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-5"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/6/report",
      },
    ],
    status: "locked",
    topics: ["Resume Writing", "Portfolio Creation", "Personal Branding"],
  },
  {
    id: 7,
    title: "Actioning Change",
    description:
      "The coach will guide you to create a step-by-step action plan towards your goal, prepare for challenges, and build strategies.",
    // duration: "50 min",
    icon: "MessageSquare",
    forms: [
      {
        id: "career-story-6",
        title: "My Story 5 [Final]",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not started",
        icon: "Book",
        route: "/journey/sessions/7/a/career-story-6",
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/7/schedule",
        prerequisites: ["career-story-6"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: ["career-story-6"],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/7/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: ["career-story-6"],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/7/report",
      },
    ],
    status: "locked",
    topics: [
      "Interview Techniques",
      "Behavioral Questions",
      "Salary Negotiation",
    ],
  },
  {
    id: 8,
    title: "Check-in for Sustenance",
    description:
      "The coach will check in with you to review progress, identify gaps, and provide support.",
    // duration: "30 min",
    icon: "Search",
    forms: [
      {
        id: "daily-journaling",
        title: "Daily Journaling",
        description:
          "Continue your career story, reflecting on key transitions, challenges, and moments of inspiration. Articulate your evolving aspirations and how your wellbeing supports your journey.",
        status: "not-completed",
        icon: "Book",
        route: "/journey/sessions/8/a/daily-journaling",
      },
      {
        id: "post-coaching",
        title: "Post Coaching Assessment",
        description:
          "Evaluate aspects of your emotional health, resilience, and positive functioning. This assessment helps you recognize strengths and areas for growth in your mental wellbeing.",
        status: "not-completed",
        icon: "Activity",
        route: "/journey/sessions/8/q/post-coaching",
        // prerequisites: ["daily-journaling"],
      },
      {
        id: "post-career-maturity",
        title: "Post Coaching Career Maturity",
        description:
          "Reflect on your attitudes, beliefs, and confidence regarding career choices and planning.",
        status: "not-completed",
        icon: "User",
        route: "/journey/sessions/8/q/post-career-maturity",
        // prerequisites: ["daily-journaling", "post-coaching"],
      },
      {
        id: "post-psychological-wellbeing",
        title: "Post Coaching Wellbeing Assessment",
        description:
          "Evaluate aspects of your emotional health, resilience, and positive functioning. This assessment helps you recognize strengths and areas for growth in your mental wellbeing.",
        status: "not-completed",
        icon: "Activity",
        route: "/journey/sessions/8/q/post-psychological-wellbeing",
        // prerequisites: ["daily-journaling", "post-coaching", "post-career-maturity"],
      },
      {
        id: "post-strength-difficulty",
        title: "Post Coaching Strength & Difficulty Assessment",
        description:
          "Evaluate aspects of your emotional health, resilience, and positive functioning. This assessment helps you recognize strengths and areas for growth in your mental wellbeing.",
        status: "not-completed",
        icon: "Activity",
        route: "/journey/sessions/8/q/post-strength-difficulty",
        // prerequisites: ["daily-journaling", "post-coaching", "post-career-maturity", "post-psychological-wellbeing"],
      },
      {
        id: "schedule-call",
        title: "Schedule Call",
        description:
          "Book a personalized coaching session to discuss your progress and next steps",
        status: "not-completed",
        icon: "Video",
        route: "/journey/sessions/8/schedule",
        prerequisites: ["daily-journaling"],
      },
      {
        id: "session-feedback",
        title: "Session Feedback",
        description: "Give us your feedback on the session",
        prerequisites: ["schedule-call"],
        // prerequisites: [
        //   "daily-journaling",
        //   "post-coaching",
        //   "post-career-maturity",
        //   "post-psychological-wellbeing",
        // ],
        status: "not-completed",
        icon: "FilePen",
        route: "/journey/sessions/8/feedback",
      },
      {
        id: "session-report",
        title: "Session Report",
        description:
          "A comprehensive summary of your session, highlighting key insights",
        prerequisites: ["session-feedback"],
        // prerequisites: [
        //   "daily-journaling",
        //   "post-coaching",
        //   "post-career-maturity",
        //   "post-psychological-wellbeing",
        // ],
        status: "not-completed",
        icon: "ClipboardList",
        route: "/journey/sessions/8/report",
      },
    ],
    status: "locked",
    topics: ["Job Boards", "Application Strategy", "Follow-up Techniques"],
  },
];
