import {
  pgTable,
  foreignKey,
  uuid,
  timestamp,
  text,
  boolean,
  unique,
  varchar,
  json,
  integer,
  serial,
  jsonb,
  numeric,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid().defaultRandom().notNull(),
    documentId: uuid().notNull(),
    documentCreatedAt: timestamp({ mode: "string" }).notNull(),
    originalText: text().notNull(),
    suggestedText: text().notNull(),
    description: text(),
    isResolved: boolean().default(false).notNull(),
    userId: uuid().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (table) => {
    return {
      suggestionUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "Suggestion_userId_User_id_fk",
      }),
    };
  }
);

export const user = pgTable(
  "User",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: varchar({ length: 64 }).notNull(),
    password: varchar({ length: 64 }),
    name: varchar({ length: 64 }),
    image: varchar({ length: 255 }),
    emailVerified: boolean("email_verified").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userEmailUnique: unique("User_email_unique").on(table.email),
    };
  }
);

export const message = pgTable(
  "Message",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    chatId: uuid().notNull(),
    role: varchar().notNull(),
    content: json().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (table) => {
    return {
      messageChatIdChatIdFk: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: "Message_chatId_Chat_id_fk",
      }),
    };
  }
);

export const chat = pgTable(
  "Chat",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    userId: uuid().notNull(),
    title: text().notNull(),
    visibility: varchar().default("private").notNull(),
  },
  (table) => {
    return {
      chatUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "Chat_userId_User_id_fk",
      }),
    };
  }
);

export const dailyJournalEntries = pgTable(
  "daily_journal_entries",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    title: text(),
    content: text().notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    entryDate: varchar("entry_date", { length: 10 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      dailyJournalUserDateUnique: unique("daily_journal_user_date_unique").on(
        table.userId,
        table.entryDate
      ),
    };
  }
);

export const feedback = pgTable("feedback", {
  id: serial().primaryKey().notNull(),
  feeling: text().notNull(),
  takeaway: text(),
  rating: integer().notNull(),
  wouldRecommend: boolean("would_recommend").default(false).notNull(),
  suggestions: text(),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  userId: text("user_id").default("anonymous").notNull(),
});

export const messageV2 = pgTable(
  "Message_v2",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    chatId: uuid().notNull(),
    role: varchar().notNull(),
    parts: json().notNull(),
    attachments: json().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (table) => {
    return {
      messageV2ChatIdChatIdFk: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: "Message_v2_chatId_Chat_id_fk",
      }),
    };
  }
);

export const chatFeedback = pgTable("chat_feedback", {
  id: serial().primaryKey().notNull(),
  chatId: varchar("chat_id", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  rating: integer().notNull(),
  comment: text(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const passwordResetToken = pgTable(
  "PasswordResetToken",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    token: varchar({ length: 255 }).notNull(),
    expiresAt: timestamp({ mode: "string" }).notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    userId: uuid().notNull(),
  },
  (table) => {
    return {
      passwordResetTokenUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "PasswordResetToken_userId_User_id_fk",
      }),
      passwordResetTokenTokenUnique: unique(
        "PasswordResetToken_token_unique"
      ).on(table.token),
    };
  }
);

export const careerStoryBoards = pgTable("career_story_boards", {
  id: serial().primaryKey().notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: integer("session_id").notNull(),
  stickyNotes: jsonb("sticky_notes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const dailyJournaling = pgTable("daily_journaling", {
  id: serial().primaryKey().notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: integer("session_id").notNull(),
  date: varchar({ length: 10 }).notNull(),
  tookAction: varchar("took_action", { length: 3 }).default(""),
  whatHeldBack: text("what_held_back").default(""),
  challenges: text().default("[]"),
  progress: text().default("[]"),
  gratitude: text().default("[]"),
  gratitudeHelp: text("gratitude_help").default("[]"),
  tomorrowStep: text("tomorrow_step").default(""),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const postCoachingAssessments = pgTable(
  "post_coaching_assessments",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    sessionId: integer("session_id").default(8).notNull(),
    answers: jsonb().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueUserSessionPostCoaching: unique(
        "unique_user_session_post_coaching"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const riasecTest = pgTable(
  "riasec_test",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    selectedAnswers: varchar("selected_answers", { length: 4000 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    categoryCounts: json("category_counts").notNull(),
    interestCode: varchar("interest_code", { length: 3 }).notNull(),
    sessionId: integer("session_id").default(2).notNull(),
  },
  (table) => {
    return {
      riasecTestUserIdSessionIdUnique: unique(
        "riasec_test_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const psychologicalWellbeingTest = pgTable(
  "psychological_wellbeing_test",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    answers: varchar({ length: 4000 }).notNull(),
    score: numeric({ precision: 5, scale: 2 }).default("0").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    subscaleScores: json("subscale_scores").default({}).notNull(),
    sessionId: integer("session_id").default(1).notNull(),
  },
  (table) => {
    return {
      psychologicalWellbeingTestUserIdUnique: unique(
        "psychological_wellbeing_test_user_id_unique"
      ).on(table.userId),
      psychologicalWellbeingTestUserIdSessionIdUnique: unique(
        "psychological_wellbeing_test_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const careerMaturityAssessment = pgTable(
  "career_maturity_assessment",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    answers: varchar({ length: 4000 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    sessionId: integer("session_id").default(1).notNull(),
  },
  (table) => {
    return {
      careerMaturityAssessmentUserIdSessionIdUnique: unique(
        "career_maturity_assessment_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const userSessionFormProgress = pgTable("user_session_form_progress", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  sessionId: integer("session_id").notNull(),
  formId: text("form_id").notNull(),
  status: varchar({ length: 32 }).notNull(),
  score: integer(),
  completedAt: varchar("completed_at", { length: 32 }),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  insights: jsonb().default({}),
});

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    token: text().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      emailVerificationTokensUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "email_verification_tokens_user_id_User_id_fk",
      }).onDelete("cascade"),
    };
  }
);

export const demographicsDetailsForm = pgTable(
  "demographics_details_form",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    fullName: varchar("full_name", { length: 100 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    email: varchar({ length: 100 }),
    age: integer(),
    education: varchar({ length: 100 }),
    stressLevel: integer("stress_level"),
    motivation: varchar({ length: 500 }),
    gender: varchar({ length: 30 }),
    profession: varchar({ length: 50 }),
    previousCoaching: varchar("previous_coaching", { length: 20 }),
  },
  (table) => {
    return {
      demographicsDetailsFormUserIdUnique: unique(
        "demographics_details_form_user_id_unique"
      ).on(table.userId),
    };
  }
);

export const preAssessment = pgTable(
  "pre_assessment",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    answers: varchar({ length: 4000 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    sessionId: integer("session_id").default(1).notNull(),
  },
  (table) => {
    return {
      preAssessmentUserIdSessionIdUnique: unique(
        "pre_assessment_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const personalityTest = pgTable(
  "personality_test",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    answers: varchar({ length: 4000 }).notNull(),
    score: numeric({ precision: 5, scale: 2 }).default("0").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    subscaleScores: json("subscale_scores").default({}).notNull(),
    sessionId: integer("session_id").default(2).notNull(),
  },
  (table) => {
    return {
      personalityTestUserIdSessionIdUnique: unique(
        "personality_test_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const careerStoryTwo = pgTable(
  "career_story_two",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    firstAdjectives: text("first_adjectives").notNull(),
    repeatedWords: text("repeated_words").notNull(),
    commonTraits: text("common_traits").notNull(),
    significantWords: text("significant_words").notNull(),
    selfStatement: text("self_statement").notNull(),
    mediaActivities: text("media_activities").notNull(),
    selectedRiasec: jsonb("selected_riasec").default([]).notNull(),
    settingStatement: text("setting_statement").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    id: uuid().defaultRandom().primaryKey().notNull(),
  },
  (table) => {
    return {
      userSessionUnique: uniqueIndex(
        "career_story_two_user_session_unique"
      ).using(
        "btree",
        table.userId.asc().nullsLast(),
        table.sessionId.asc().nullsLast()
      ),
    };
  }
);

export const letterFromFutureSelf = pgTable("letter_from_future_self", {
  id: serial().primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  sessionId: integer("session_id").notNull(),
  letter: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: timestamp("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const careerOptionsMatrix = pgTable("career_options_matrix", {
  id: serial().primaryKey().notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: integer("session_id").notNull(),
  rows: jsonb().notNull(),
  columns: jsonb().notNull(),
  cells: jsonb().notNull(),
  createdAt: timestamp("created_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const careerStoryFours = pgTable("career_story_four", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  sessionId: integer("session_id").notNull(),
  rewrittenStory: text("rewritten_story").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const careerStoryOne = pgTable(
  "career_story_one",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    transitionEssay: text("transition_essay").notNull(),
    occupations: text().notNull(),
    heroes: jsonb().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    mediaPreferences: text("media_preferences").default("").notNull(),
    favoriteStory: text("favorite_story").default("").notNull(),
    favoriteSaying: text("favorite_saying").default("").notNull(),
  },
  (table) => {
    return {
      userSessionIdx: uniqueIndex("career_story_one_user_session_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.sessionId.asc().nullsLast()
      ),
    };
  }
);

export const journeyProgress = pgTable("journey_progress", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  currentSession: integer("current_session").notNull(),
  completedSessions: json("completed_sessions").notNull(),
  totalScore: integer("total_score").notNull(),
  lastActiveDate: varchar("last_active_date", { length: 32 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  enableByCoach: jsonb("enable_by_coach").default({}),
});

export const myLifeCollage = pgTable(
  "my_life_collage",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    presentLifeCollage: jsonb("present_life_collage").default([]).notNull(),
    futureLifeCollage: jsonb("future_life_collage").default([]).notNull(),
    retirementValues: text("retirement_values").default("").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => {
    return {
      myLifeCollageUserSessionUnique: unique(
        "my_life_collage_user_session_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const careerStoryThree = pgTable(
  "career_story_three",
  {
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    selfStatement: text("self_statement").notNull(),
    settingStatement: text("setting_statement").notNull(),
    plotDescription: text("plot_description").notNull(),
    plotActivities: text("plot_activities").notNull(),
    ableToBeStatement: text("able_to_be_statement").notNull(),
    placesWhereStatement: text("places_where_statement").notNull(),
    soThatStatement: text("so_that_statement").notNull(),
    mottoStatement: text("motto_statement").notNull(),
    selectedOccupations: jsonb("selected_occupations").default([]).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).default(sql`CURRENT_TIMESTAMP`),
    id: uuid().defaultRandom().primaryKey().notNull(),
  },
  (table) => {
    return {
      userSessionIdx: index("career_story_three_user_session_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.sessionId.asc().nullsLast()
      ),
    };
  }
);

export const postCareerMaturity = pgTable(
  "post_career_maturity",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    answers: jsonb().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    sessionId: integer("session_id").default(8).notNull(),
  },
  (table) => {
    return {
      postCareerMaturityUserIdSessionIdUnique: unique(
        "post_career_maturity_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const postPsychologicalWellbeingTest = pgTable(
  "post_psychological_wellbeing_test",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    answers: varchar({ length: 4000 }).notNull(),
    score: numeric({ precision: 5, scale: 2 }).default("0").notNull(),
    subscaleScores: json("subscale_scores").default({}).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      postPsychologicalWellbeingTestUserIdSessionIdUnique: unique(
        "post_psychological_wellbeing_test_user_id_session_id_unique"
      ).on(table.userId, table.sessionId),
    };
  }
);

export const vote = pgTable(
  "Vote",
  {
    chatId: uuid().notNull(),
    messageId: uuid().notNull(),
    isUpvoted: boolean().notNull(),
  },
  (table) => {
    return {
      voteChatIdChatIdFk: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: "Vote_chatId_Chat_id_fk",
      }),
      voteMessageIdMessageIdFk: foreignKey({
        columns: [table.messageId],
        foreignColumns: [message.id],
        name: "Vote_messageId_Message_id_fk",
      }),
      voteChatIdMessageIdPk: primaryKey({
        columns: [table.chatId, table.messageId],
        name: "Vote_chatId_messageId_pk",
      }),
    };
  }
);

export const voteV2 = pgTable(
  "Vote_v2",
  {
    chatId: uuid().notNull(),
    messageId: uuid().notNull(),
    isUpvoted: boolean().notNull(),
  },
  (table) => {
    return {
      voteV2ChatIdChatIdFk: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: "Vote_v2_chatId_Chat_id_fk",
      }),
      voteV2MessageIdMessageV2IdFk: foreignKey({
        columns: [table.messageId],
        foreignColumns: [messageV2.id],
        name: "Vote_v2_messageId_Message_v2_id_fk",
      }),
      voteV2ChatIdMessageIdPk: primaryKey({
        columns: [table.chatId, table.messageId],
        name: "Vote_v2_chatId_messageId_pk",
      }),
    };
  }
);

export const document = pgTable(
  "Document",
  {
    id: uuid().defaultRandom().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    title: text().notNull(),
    content: text(),
    userId: uuid().notNull(),
    text: varchar().default("text").notNull(),
  },
  (table) => {
    return {
      documentUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "Document_userId_User_id_fk",
      }),
      documentIdCreatedAtPk: primaryKey({
        columns: [table.id, table.createdAt],
        name: "Document_id_createdAt_pk",
      }),
    };
  }
);
