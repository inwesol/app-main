// // // lib/db/schema.ts - Fixed version with consistent snake_case naming
// import type { InferSelectModel } from 'drizzle-orm';
// import {
//   pgTable,
//   varchar,
//   timestamp,
//   json,
//   uuid,
//   text,
//   primaryKey,
//   boolean,
// } from 'drizzle-orm/pg-core';

// // User table with consistent snake_case column naming
// export const user = pgTable('User', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   email: varchar('email', { length: 64 }).notNull().unique(),
//   password: varchar('password', { length: 64 }), // Nullable for OAuth users
//   name: varchar('name', { length: 64 }),
//   image: varchar('image', { length: 255 }),
//   email_verified: boolean('email_verified').default(false).notNull(),
//   created_at: timestamp('created_at').defaultNow().notNull(),
//   updated_at: timestamp('updated_at').defaultNow().notNull(),
// });

// export type User = InferSelectModel<typeof user>;

// // Email Verification Tokens table
// export const emailVerificationTokens = pgTable('email_verification_tokens', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
//   token: text('token').notNull(),
//   expires_at: timestamp('expires_at').notNull(),
//   created_at: timestamp('created_at').defaultNow().notNull(),
// });

// export type EmailVerificationToken = InferSelectModel<typeof emailVerificationTokens>;

// // Password Reset Token table
// export const passwordResetTokens = pgTable('password_reset_tokens', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
//   token: text('token').notNull(),
//   expires_at: timestamp('expires_at').notNull(),
//   created_at: timestamp('created_at').defaultNow().notNull(),
// });

// export type PasswordResetToken = InferSelectModel<typeof passwordResetTokens>;

// // Chat table - using snake_case consistently
// export const chat = pgTable('Chat', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   created_at: timestamp('created_at').notNull().defaultNow(),
//   title: text('title').notNull(),
//   user_id: uuid('user_id')
//     .notNull()
//     .references(() => user.id),
//   visibility: varchar('visibility', { enum: ['public', 'private'] })
//     .notNull()
//     .default('private'),
// });

// export type Chat = InferSelectModel<typeof chat>;

// // DEPRECATED: The following schema is deprecated and will be removed in the future.
// export const messageDeprecated = pgTable('Message', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   chat_id: uuid('chat_id')
//     .notNull()
//     .references(() => chat.id),
//   role: varchar('role').notNull(),
//   content: json('content').notNull(),
//   created_at: timestamp('created_at').notNull().defaultNow(),
// });

// export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

// // Current message table with snake_case
// export const message = pgTable('Message_v2', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   chat_id: uuid('chat_id')
//     .notNull()
//     .references(() => chat.id),
//   role: varchar('role').notNull(),
//   parts: json('parts').notNull(),
//   attachments: json('attachments').notNull(),
//   created_at: timestamp('created_at').notNull().defaultNow(),
// });

// export type DBMessage = InferSelectModel<typeof message>;

// // DEPRECATED: The following schema is deprecated and will be removed in the future.
// export const voteDeprecated = pgTable(
//   'Vote',
//   {
//     chat_id: uuid('chat_id')
//       .notNull()
//       .references(() => chat.id),
//     message_id: uuid('message_id')
//       .notNull()
//       .references(() => messageDeprecated.id),
//     is_upvoted: boolean('is_upvoted').notNull(),
//   },
//   (table) => {
//     return {
//       pk: primaryKey({ columns: [table.chat_id, table.message_id] }),
//     };
//   },
// );

// export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

// // Current vote table with snake_case
// export const vote = pgTable(
//   'Vote_v2',
//   {
//     chat_id: uuid('chat_id')
//       .notNull()
//       .references(() => chat.id),
//     message_id: uuid('message_id')
//       .notNull()
//       .references(() => message.id),
//     is_upvoted: boolean('is_upvoted').notNull(),
//   },
//   (table) => {
//     return {
//       pk: primaryKey({ columns: [table.chat_id, table.message_id] }),
//     };
//   },
// );

// export type Vote = InferSelectModel<typeof vote>;

// // Document table with snake_case
// export const document = pgTable('Document', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   created_at: timestamp('created_at').notNull().defaultNow(),
//   title: text('title').notNull(),
//   content: text('content'),
//   kind: varchar('kind', { enum: ['text', 'code', 'image', 'sheet'] })
//     .notNull()
//     .default('text'),
//   user_id: uuid('user_id')
//     .notNull()
//     .references(() => user.id),
// });

// export type Document = InferSelectModel<typeof document>;

// // Suggestion table with snake_case
// export const suggestion = pgTable('Suggestion', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   document_id: uuid('document_id')
//     .notNull()
//     .references(() => document.id),
//   document_created_at: timestamp('document_created_at').notNull(),
//   original_text: text('original_text').notNull(),
//   suggested_text: text('suggested_text').notNull(),
//   description: text('description'),
//   is_resolved: boolean('is_resolved').notNull().default(false),
//   user_id: uuid('user_id')
//     .notNull()
//     .references(() => user.id),
//   created_at: timestamp('created_at').notNull().defaultNow(),
// });

// export type Suggestion = InferSelectModel<typeof suggestion>;

// // Legacy type exports for backward compatibility
// export type NewUser = typeof user.$inferInsert;

import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
  unique,
  numeric,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
// import { z } from "zod";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }), // Nullable for OAuth users
  name: varchar("name", { length: 64 }),
  image: varchar("image", { length: 255 }),
  email_verified: boolean("email_verified").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof user>;

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type EmailVerificationToken = InferSelectModel<
  typeof emailVerificationTokens
>;

// Password Reset Token table
export const passwordResetToken = pgTable("PasswordResetToken", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type PasswordResetToken = InferSelectModel<typeof passwordResetToken>;

// Chat table - using snake_case consistently
export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
export const messageDeprecated = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

// Current message table with snake_case
export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
export const voteDeprecated = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

// Current vote table with snake_case
export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

// Document table with snake_case
export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

// Suggestion table with snake_case
export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

// journey table
export const journey_progress = pgTable("journey_progress", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  current_session: integer("current_session").notNull(),
  completed_sessions: json("completed_sessions").notNull(), // array of numbers
  total_score: integer("total_score").notNull(),
  last_active_date: varchar("last_active_date", { length: 32 }).notNull(), // or timestamp
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// per-user, per-session, per-form progress
export const user_session_form_progress = pgTable(
  "user_session_form_progress",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    session_id: integer("session_id").notNull(),
    form_id: text("form_id").notNull(),
    status: varchar("status", { length: 32 }).notNull(), // completed | in-progress | not-started
    score: integer("score"),
    completed_at: varchar("completed_at", { length: 32 }), // ISO string
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  }
);

// demographic details form response table
export const demographics_details_form = pgTable(
  "demographics_details_form",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    full_name: varchar("full_name", { length: 100 }),
    email: varchar("email", { length: 100 }),
    age: integer("age"),
    gender: varchar("gender", { length: 30 }),
    profession: varchar("profession", { length: 50 }),
    previous_coaching: varchar("previous_coaching", { length: 20 }),
    education: varchar("education", { length: 100 }),
    stress_level: integer("stress_level"),
    motivation: varchar("motivation", { length: 500 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userUnique: unique().on(table.user_id), // <-- enforces unique user_id constraint
  })
);
export const career_maturity_assessment = pgTable(
  "career_maturity_assessment",

  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(1),

    answers: varchar("answers", { length: 4000 }).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),

    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },

  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id),
  })
);

export const pre_assessment = pgTable(
  "pre_assessment",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    session_id: integer("session_id").notNull().default(1),
    answers: varchar("answers", { length: 4000 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id),
  })
);

export const riasec_test = pgTable(
  "riasec_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(2),

    // Store the raw array of selected answers as JSON text
    selected_answers: varchar("selected_answers", { length: 4000 }).notNull(),

    // Store counts per category as JSONB
    category_counts: json("category_counts")
      .$type<Record<string, number>>()
      .notNull(),

    // Store the interest code (top 3 letters concatenated, e.g. "RIS")
    interest_code: varchar("interest_code", { length: 3 }).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id),
  })
);

export const personality_test = pgTable(
  "personality_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(2),

    answers: varchar("answers", { length: 4000 }).notNull(), // JSON stringified answers

    score: numeric("score", { precision: 5, scale: 2 }).notNull().default("0"), // overall score

    subscale_scores: json("subscale_scores")
      .$type<Record<string, number>>()
      .notNull()
      .default({}), // subscale averages JSON

    created_at: timestamp("created_at").defaultNow().notNull(),

    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id), // unique by user_id and session_id
  })
);

export const psychological_wellbeing_test = pgTable(
  "psychological_wellbeing_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(1),

    answers: varchar("answers", { length: 4000 }).notNull(), // JSON string of answers

    score: numeric("score", { precision: 5, scale: 2 }).notNull().default("0"), // float score

    subscale_scores: json("subscale_scores")
      .$type<Record<string, number>>()
      .notNull()
      .default({}), // empty JSON object default

    created_at: timestamp("created_at").defaultNow().notNull(),

    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id), // unique constraint on user_id + session_id
  })
);

export const chat_feedback = pgTable("chat_feedback", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chat_id: varchar("chat_id", { length: 255 }).notNull(),
  user_email: varchar("user_email", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"), // Optional feedback comment
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ChatFeedback = InferSelectModel<typeof chat_feedback>;

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  feeling: text("feeling").notNull(), // e.g., 'enlightened', 'confident', etc.
  takeaway: text("takeaway"),
  rating: integer("rating").notNull(), // 1-5 stars
  wouldRecommend: boolean("would_recommend").default(false),
  suggestions: text("suggestions"),
  sessionId: integer("session_id"), // zero-based session index
  userId: uuid("user_id"),
  userAgent: text("user_agent"), // Optional: for analytics
  createdAt: timestamp("created_at").defaultNow(),
});

export type Feedback = typeof feedback.$inferInsert;
export type FeedbackSelect = typeof feedback.$inferSelect;

// Add this table definition to your existing schema.ts file
export const career_story_boards = pgTable(
  "career_story_boards",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    session_id: integer("session_id").notNull(),
    sticky_notes: json("sticky_notes").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userSessionIdx: uniqueIndex("career_story_boards_user_session_idx").on(
      table.user_id,
      table.session_id
    ),
  })
);

// Add this type export at the bottom of your schema.ts file
export type CareerStoryBoard = typeof career_story_boards.$inferSelect;
export type NewCareerStoryBoard = typeof career_story_boards.$inferInsert;

export const dailyJournalingTable = pgTable("daily_journaling", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: integer("session_id").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  tookAction: varchar("took_action", { length: 3 }).default(""), // "yes", "no", or ""
  whatHeldBack: text("what_held_back").default(""),
  challenges: text("challenges").default("[]"), // JSON string
  progress: text("progress").default("[]"), // JSON string
  gratitude: text("gratitude").default("[]"), // JSON string
  gratitudeHelp: text("gratitude_help").default("[]"), // JSON string
  tomorrowStep: text("tomorrow_step").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export the table type for TypeScript
export type DailyJournalingTable = typeof dailyJournalingTable;

export const careerStoryTwo = pgTable(
  "career_story_two",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    firstAdjectives: text("first_adjectives").notNull(),
    repeatedWords: text("repeated_words").notNull(),
    commonTraits: text("common_traits").notNull(),
    significantWords: text("significant_words").notNull(),
    selfStatement: text("self_statement").notNull(),
    mediaActivities: text("media_activities").notNull(),
    selectedRiasec: jsonb("selected_riasec").notNull().default([]),
    settingStatement: text("setting_statement").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userSessionUnique: uniqueIndex("career_story_two_user_session_unique").on(
        table.userId,
        table.sessionId
      ),
    };
  }
);

export const careerStoryThree = pgTable(
  "career_story_three",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
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
    selectedOccupations: jsonb("selected_occupations").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.userId, table.sessionId),
  })
);

export const letterFromFutureSelfTable = pgTable(
  "letter_from_future_self",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: varchar("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    letter: text("letter").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueUserSession: unique().on(table.userId, table.sessionId),
  })
);

export const careerOptionsMatrix = pgTable("career_options_matrix", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: integer("session_id").notNull(),
  rows: jsonb("rows").notNull(), // Array of MatrixRow objects
  columns: jsonb("columns").notNull(), // Array of MatrixColumn objects
  cells: jsonb("cells").notNull(), // Array of MatrixCell objects
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const careerStoryFours = pgTable(
  "career_story_fours",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    rewrittenStory: text("rewritten_story").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.userId, table.sessionId),
  })
);

export const careerStoryOneTable = pgTable(
  "career_story_one",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    transitionEssay: text("transition_essay").notNull(),
    occupations: text("occupations").notNull(),
    heroes: jsonb("heroes")
      .$type<
        Array<{
          id: string;
          title: string;
          description: string;
        }>
      >()
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionIdx: uniqueIndex("career_story_one_user_session_idx").on(
      table.userId,
      table.sessionId
    ),
  })
);

export const myLifeCollageTable = pgTable(
  "my_life_collage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    presentLifeCollage: jsonb("present_life_collage").notNull().default([]),
    futureLifeCollage: jsonb("future_life_collage").notNull().default([]),
    retirementValues: text("retirement_values").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userSessionUnique: unique("my_life_collage_user_session_unique").on(
      table.userId,
      table.sessionId
    ),
  })
);

export const postCareerMaturityTable = pgTable(
  "post_career_maturity",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => user.id),
    session_id: integer("session_id").notNull().default(1),
    answers: jsonb("answers").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id),
  })
);

export type PostCareerMaturity = typeof postCareerMaturityTable.$inferSelect;
export type InsertPostCareerMaturity =
  typeof postCareerMaturityTable.$inferInsert;

// Add this to your schema.ts file exports
export const post_psychological_wellbeing_test = pgTable(
  "post_psychological_wellbeing_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    session_id: integer("session_id").notNull(),
    answers: varchar("answers", { length: 4000 }).notNull(), // JSON string of answers
    score: numeric("score", { precision: 5, scale: 2 }).notNull().default("0"), // float score
    subscale_scores: json("subscale_scores")
      .$type<Record<string, number>>()
      .notNull()
      .default({}), // empty JSON object default
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSessionUnique: unique().on(table.user_id, table.session_id), // unique constraint on user_id + session_id
  })
);

export const postCoachingAssessments = pgTable(
  "post_coaching_assessments",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id").notNull(),
    sessionId: integer("session_id").notNull().default(8),
    answers: jsonb("answers").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserSession: unique("unique_user_session_post_coaching").on(
      table.userId,
      table.sessionId
    ),
  })
);

// Daily Journal Entries table for simple journaling
export const dailyJournalEntries = pgTable(
  "daily_journal_entries",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title"),
    content: text("content").notNull(),
    wordCount: integer("word_count").notNull().default(0),
    entryDate: varchar("entry_date", { length: 10 }).notNull(), // YYYY-MM-DD format
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateUnique: unique("daily_journal_user_date_unique").on(
      table.userId,
      table.entryDate
    ),
  })
);

export type DailyJournalEntry = typeof dailyJournalEntries.$inferSelect;
export type NewDailyJournalEntry = typeof dailyJournalEntries.$inferInsert;
