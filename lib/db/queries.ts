// lib/db/queries.ts - Fixed version with consistent camelCase naming
import "server-only";
import { hash, genSaltSync, hashSync } from "bcrypt-ts";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  SQL,
  sql,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import crypto from "crypto";
import {
  user,
  emailVerificationTokens,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  Chat,
  passwordResetToken,
  type PasswordResetToken,
  journey_progress,
  user_session_form_progress,
  demographics_details_form,
  career_maturity_assessment,
  pre_assessment,
  riasec_test,
  personality_test,
  psychological_wellbeing_test,
  feedback,
  career_story_boards,
  dailyJournalingTable,
  careerStoryThree,
  letterFromFutureSelfTable,
  careerOptionsMatrix,
  careerStoryFours,
  careerStoryOneTable,
  myLifeCollageTable,
  postCareerMaturityTable,
  post_psychological_wellbeing_test,
  postCoachingAssessments,
} from "./schema";
import { ArtifactKind } from "@/components/artifact";
import { SESSION_TEMPLATES } from "@/lib/constants";
import { careerStoryTwo } from "@/lib/db/schema";

import type { DailyJournalingData } from "@/lib/schemas/activity-schemas/daily-journaling-schema";
import type { CareerStoryTwoData } from "@/lib/schemas/activity-schemas/career-story-two-schema";
import type { CareerStoryThreeData } from "@/lib/schemas/activity-schemas/career-story-three-schema";
import { CareerOptionsMatrixData } from "../schemas/activity-schemas/career-option-matrix-schema";
import { CareerStoryFour } from "@/lib/schemas/activity-schemas/career-story-four-schema";
import { CareerStoryOneData } from "@/lib/schemas/activity-schemas/career-story-one-schema";
import type { LifeCollageFormData } from "@/lib/schemas/activity-schemas/life-collage-schema";

// Database connection
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

// User Management Functions
export async function createUser(
  email: string,
  password: string | null = null,
  name?: string | null,
  image?: string | null
): Promise<User> {
  try {
    console.log("Creating user with:", {
      email,
      hasPassword: !!password,
      name,
      image,
    });

    const values: any = {
      email,
      createdAt: new Date(),
      email_verified: false,
    };

    if (password) {
      const salt = genSaltSync(10);
      const hashPassword = hashSync(password, salt);
      values.password = hashPassword;
    }

    if (name) values.name = name;
    if (image) values.image = image;

    const [newUser] = await db.insert(user).values(values).returning();
    console.log("User created successfully:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function getUser(email: string): Promise<Array<User>> {
  try {
    console.log("Getting user by email:", email);
    const result = await db.select().from(user).where(eq(user.email, email));
    console.log("Users found:", result.length);
    return result;
  } catch (error) {
    console.error("Failed to get user from database:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    console.log("Getting user by ID:", id);
    const [selectedUser] = await db.select().from(user).where(eq(user.id, id));
    return selectedUser || null;
  } catch (error) {
    console.error("Failed to get user by id from database:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log("Getting user by email (single):", email);
    const [selectedUser] = await db
      .select({
        id: user.id,
        email: user.email,
        password: user.password,
        email_verified: user.email_verified,
        name: user.name,
        image: user.image,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })
      .from(user)
      .where(eq(user.email, email));

    console.log("User found:", !!selectedUser);
    return selectedUser || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function updateUser(
  id: string,
  updates: {
    name?: string | null;
    image?: string | null;
    email?: string;
    email_verified?: boolean;
  }
): Promise<User> {
  try {
    console.log("Updating user:", id, updates);

    const [updatedUser] = await db
      .update(user)
      .set({
        ...updates,
        updated_at: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    console.log("User updated successfully");
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user in database:", error);
    throw error;
  }
}

// Email Verification Functions
export async function createEmailVerificationToken(
  userId: string
): Promise<string> {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Creating email verification token for user:", userId);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log("Creating verification token:", { userId, otp, expiresAt });

    // Delete any existing tokens for this user first
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.user_id, userId));

    // Insert new token
    await db.insert(emailVerificationTokens).values({
      id: crypto.randomUUID(),
      user_id: userId,
      token: otp,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    console.log("Email verification token created successfully");
    return otp;
  } catch (error) {
    console.error("Error creating email verification token:", error);
    throw new Error("Failed to create email verification token");
  }
}

export async function verifyEmailToken(
  otp: string
): Promise<{ success: boolean; userId?: string; userEmail?: string }> {
  try {
    console.log("Verifying OTP:", otp);

    const [tokenRecord] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, otp))
      .limit(1);

    if (!tokenRecord) {
      console.log("Token not found");
      return { success: false };
    }

    console.log("Token found:", {
      userId: tokenRecord.user_id,
      expiresAt: tokenRecord.expires_at,
    });

    // Check if token has expired
    if (new Date() > tokenRecord.expires_at) {
      console.log("Token expired");
      await db
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.id, tokenRecord.id));
      return { success: false };
    }

    // Get user details before updating
    const [userData] = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.id, tokenRecord.user_id))
      .limit(1);

    // Mark user as verified
    await db
      .update(user)
      .set({
        email_verified: true,
        updated_at: new Date(),
      })
      .where(eq(user.id, tokenRecord.user_id));

    // Delete the used token
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.id, tokenRecord.id));

    console.log("Email verified successfully");
    return {
      success: true,
      userId: tokenRecord.user_id,
      userEmail: userData?.email,
    };
  } catch (error) {
    console.error("Error verifying email token:", error);
    return { success: false };
  }
}

// OAuth Integration
export async function findOrCreateGoogleUser(
  email: string,
  name: string | null,
  image: string | null
): Promise<User> {
  try {
    console.log("Finding or creating Google user:", email);

    const existingUsers = await getUser(email);

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      console.log("Google user exists, updating info");

      if (
        existingUser.name !== name ||
        existingUser.image !== image ||
        !existingUser.email_verified
      ) {
        const updatedUser = await updateUser(existingUser.id, {
          name,
          image,
          email_verified: true, // OAuth users are considered verified
        });
        return updatedUser;
      }

      return existingUser;
    }

    console.log("Creating new Google user");
    const newUser = await createUser(email, null, name, image);
    const updatedUser = await updateUser(newUser.id, { email_verified: true });
    return updatedUser;
  } catch (error) {
    console.error("Failed to find or create Google user:", error);
    throw error;
  }
}

// Password Reset Functions
export async function createPasswordResetToken(
  userId: string
): Promise<string> {
  try {
    console.log("Creating password reset token for user:", userId);

    const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.userId, userId));

    await db.insert(passwordResetToken).values({
      userId: userId,
      token,
      expiresAt: expiresAt,
      createdAt: new Date(),
    });

    console.log("Password reset token created successfully");
    return token;
  } catch (error) {
    console.error("Failed to create password reset token:", error);
    throw error;
  }
}

export async function getPasswordResetToken(
  token: string
): Promise<PasswordResetToken | null> {
  try {
    const [resetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token))
      .limit(1);

    return resetToken || null;
  } catch (error) {
    console.error("Failed to get password reset token:", error);
    throw error;
  }
}

export async function deletePasswordResetToken(token: string) {
  try {
    return await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, token));
  } catch (error) {
    console.error("Failed to delete password reset token:", error);
    throw error;
  }
}

export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<User> {
  try {
    console.log("Resetting password for user:", userId);

    const salt = genSaltSync(10);
    const hashPassword = hashSync(newPassword, salt);

    const [updatedUser] = await db
      .update(user)
      .set({
        password: hashPassword,
        updated_at: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    console.log("Password reset successfully");
    return updatedUser;
  } catch (error) {
    console.error("Failed to reset user password:", error);
    throw error;
  }
}

export async function isPasswordResetTokenValid(
  token: string
): Promise<boolean> {
  try {
    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return false;
    }

    const now = new Date();
    return resetToken.expiresAt > now;
  } catch (error) {
    console.error("Failed to validate password reset token:", error);
    return false;
  }
}

// Cleanup Functions
export async function cleanupExpiredPasswordResetTokens() {
  try {
    const now = new Date();
    return await db
      .delete(passwordResetToken)
      .where(lt(passwordResetToken.expiresAt, now));
  } catch (error) {
    console.error("Failed to cleanup expired password reset tokens:", error);
    throw error;
  }
}

export async function cleanupExpiredEmailVerificationTokens() {
  try {
    const now = new Date();
    return await db
      .delete(emailVerificationTokens)
      .where(lt(emailVerificationTokens.expires_at, now));
  } catch (error) {
    console.error(
      "Failed to cleanup expired email verification tokens:",
      error
    );
    throw error;
  }
}

// Chat Management Functions
export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId: userId,
      title,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;
    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id)
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;
    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error("Failed to update chat visibility in database");
    throw error;
  }
}

// Message Management Functions
export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error("Failed to get message by id from database");
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
        );
      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds))
        );
    }
  } catch (error) {
    console.error(
      "Failed to delete messages by id after timestamp from database"
    );
    throw error;
  }
}

// Vote Management Functions
export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }

    return await db.insert(vote).values({
      chatId: chatId,
      messageId: messageId,
      isUpvoted: type === "up",
    });
  } catch (error) {
    console.error("Failed to upvote message in database", error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error("Failed to get votes by chat id from database", error);
    throw error;
  }
}

// Document Management Functions
export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId: userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to save document in database");
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));
    return documents;
  } catch (error) {
    console.error("Failed to get document by id from database");
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));
    return selectedDocument;
  } catch (error) {
    console.error("Failed to get document by id from database");
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp)
        )
      );
    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      "Failed to delete documents by id after timestamp from database"
    );
    throw error;
  }
}

// Suggestion Management Functions
export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error("Failed to save suggestions in database");
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      "Failed to get suggestions by document version from database"
    );
    throw error;
  }
}

// Utility Functions for OAuth and Account Management
export async function linkProviderAccount({
  userId,
  provider,
  providerAccountId,
  accessToken,
  refreshToken,
}: {
  userId: string;
  provider: string;
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
}) {
  try {
    console.log("Provider account linked:", {
      userId,
      provider,
      providerAccountId,
    });
    return true;
  } catch (error) {
    console.error("Failed to link provider account");
    throw error;
  }
}

// Delete user function with proper column naming
export async function deleteUser(id: string) {
  try {
    console.log("Deleting user:", id);

    // Delete user's related data first
    const userChats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, id));
    const chatIds = userChats.map((c) => c.id);

    if (chatIds.length > 0) {
      await db.delete(vote).where(inArray(vote.chatId, chatIds));
      await db.delete(message).where(inArray(message.chatId, chatIds));
      await db.delete(chat).where(eq(chat.userId, id));
    }

    // Get user's documents first, then delete related suggestions
    const userDocuments = await db
      .select({ id: document.id })
      .from(document)
      .where(eq(document.userId, id));
    const documentIds = userDocuments.map((d) => d.id);

    if (documentIds.length > 0) {
      await db
        .delete(suggestion)
        .where(inArray(suggestion.documentId, documentIds));
    }
    await db.delete(document).where(eq(document.userId, id));

    // Delete user's tokens
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.userId, id));
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.user_id, id));

    // Finally delete the user
    const result = await db.delete(user).where(eq(user.id, id));
    console.log("User deleted successfully");
    return result;
  } catch (error) {
    console.error("Failed to delete user from database:", error);
    throw error;
  }
}

export async function getUserJourneyProgress(userId: string) {
  const [progress] = await db
    .select()
    .from(journey_progress)
    .where(eq(journey_progress.user_id, userId))
    .limit(1);

  if (!progress) return null;
  return {
    userId: progress.user_id,
    currentSession: progress.current_session,
    completedSessions: progress.completed_sessions, // JSON array
    totalScore: progress.total_score,
    lastActiveDate: progress.last_active_date,
  };
}

// <-- This is for the FIRST TIME user -- create initial progress row!
export async function createUserJourneyProgress({
  userId,
  currentSession,
  completedSessions,
  totalScore,
  lastActiveDate,
}: {
  userId: string;
  currentSession: number;
  completedSessions: number[];
  totalScore: number;
  lastActiveDate: string;
}) {
  const [created] = await db
    .insert(journey_progress)
    .values({
      user_id: userId,
      current_session: currentSession,
      completed_sessions: completedSessions,
      total_score: totalScore,
      last_active_date: lastActiveDate,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();
  // Return in the UserProgress shape
  return {
    userId: created.user_id,
    currentSession: created.current_session,
    completedSessions: created.completed_sessions,
    totalScore: created.total_score,
    lastActiveDate: created.last_active_date,
  };
}
// for session details page
export async function getSessionDetailForUser(
  userId: string,
  sessionId: number
) {
  // 1. Find session template (static)
  const template = SESSION_TEMPLATES.find((s) => s.id === sessionId);
  if (!template) return null;

  // 2. Fetch user's form progress for this session
  const userFormProgress = await db
    .select()
    .from(user_session_form_progress)
    .where(
      and(
        eq(user_session_form_progress.user_id, userId),
        eq(user_session_form_progress.session_id, sessionId)
      )
    );

  // 3. Merge static forms with user progress data
  const forms = template.forms.map((form) => {
    const progress = userFormProgress.find((pf) => pf.form_id === form.id);
    return {
      ...form,
      status: progress?.status || "not-completed",
      // score: progress?.score ?? undefined,
      // completedAt: progress?.completed_at ?? undefined,
    };
  });

  // 4. Compute overall session status/score
  const isAllCompleted =
    forms.length > 0 && forms.every((f) => f.status === "completed");
  const status = isAllCompleted ? "completed" : "not-completed";

  // const scoreForms = forms.filter(
  //   (f) => f.status === "completed" && typeof f.score === "number"
  // );
  // const overallScore =
  //   scoreForms.length > 0
  //     ? Math.round(
  //         scoreForms.reduce((acc, f) => acc + (f.score ?? 0), 0) /
  //           scoreForms.length
  //       )
  //     : 0;

  // 5. Return session detail "hydrated" with user info
  return {
    ...template,
    forms,
    status,
    // overallScore,
  };
}
export async function upsertUserDemographics(userId: string, data: any) {
  // Convert age to integer if present (from string in form)
  const age = data.age !== undefined ? parseInt(data.age, 10) : null;
  // Convert stress level if needed
  const stressLevel =
    data.stressLevel !== undefined ? parseInt(data.stressLevel, 10) : null;
  await db
    .insert(demographics_details_form)
    .values({
      user_id: userId,
      full_name: data.fullName,
      email: data.email,
      age,
      gender: data.gender,
      profession: data.profession,
      previous_coaching: data.previousCoaching,
      education: data.education,
      stress_level: stressLevel,
      motivation: data.motivation,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [demographics_details_form.user_id],
      set: {
        full_name: data.fullName,
        email: data.email,
        age,
        gender: data.gender,
        profession: data.profession,
        previous_coaching: data.previousCoaching,
        education: data.education,
        stress_level: stressLevel,
        motivation: data.motivation,
        updated_at: new Date(),
      },
    });
}
export async function completeUserSessionFormProgress({
  userId,
  sessionId,
  qId,
}: {
  userId: string;
  sessionId: number;
  qId: string;
}) {
  const [progress] = await db
    .select()
    .from(user_session_form_progress)
    .where(
      and(
        eq(user_session_form_progress.user_id, userId),
        eq(user_session_form_progress.session_id, sessionId),
        eq(user_session_form_progress.form_id, qId)
      )
    );
  if (progress) {
    await db
      .update(user_session_form_progress)
      .set({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date(),
      })
      .where(eq(user_session_form_progress.id, progress.id));
  } else {
    await db.insert(user_session_form_progress).values({
      user_id: userId,
      session_id: sessionId,
      form_id: qId,
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date(),
    });
  }
}
// Update overall journey_progress summary after form completion
export async function updateJourneyProgressAfterForm(
  userId: string,
  sessionId: number
  // scoreForSession: number
) {
  const [jp] = await db
    .select()
    .from(journey_progress)
    .where(eq(journey_progress.user_id, userId));
  if (jp) {
    let completedSessions: number[] = jp.completed_sessions ?? [];
    if (!completedSessions.includes(sessionId)) {
      completedSessions.push(sessionId);
    }
    // Calculate the new total score
    // Each completed session is worth 100 points
    const newTotalScore = (jp.total_score ?? 0) + 100;

    // Set current_session to the next one, up to your last session number
    const nextSession = Math.max(...completedSessions) + 1;

    await db
      .update(journey_progress)
      .set({
        completed_sessions: completedSessions,
        last_active_date: new Date().toISOString(),
        updated_at: new Date(),
        current_session: nextSession,
        total_score: newTotalScore,
      })
      .where(eq(journey_progress.user_id, userId));
  }
}

export async function getUserDemographics(userId: string) {
  const [details] = await db
    .select()
    .from(demographics_details_form)
    .where(eq(demographics_details_form.user_id, userId));
  return details || null;
}

export async function upsertCareerMaturityAssessment(
  userId: string,
  sessionId: number,
  answers: Record<string, "agree" | "disagree">
) {
  const answersJson = JSON.stringify(answers);

  await db
    .insert(career_maturity_assessment)
    .values({
      user_id: userId,
      // session_id: sessionId,
      answers: answersJson,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        career_maturity_assessment.user_id,
        // career_maturity_assessment.session_id,
      ],
      set: {
        answers: answersJson,
        updated_at: new Date(),
      },
    });
}

export async function getCareerMaturityAssessment(
  userId: string,
  sessionId: number
): Promise<Record<string, "agree" | "disagree"> | null> {
  const [row] = await db
    .select()
    .from(career_maturity_assessment)
    .where(
      and(
        eq(career_maturity_assessment.user_id, userId)
        // eq(career_maturity_assessment.session_id, sessionId)
      )
    );

  if (!row) return null;

  try {
    return JSON.parse(row.answers);
  } catch {
    return null;
  }
}
export async function getPreAssessment(
  userId: string,
  sessionId: number
): Promise<{
  answers: Record<string, "agree" | "disagree">;
} | null> {
  const [row] = await db
    .select()
    .from(pre_assessment)
    .where(
      and(
        eq(pre_assessment.user_id, userId)
        // eq(pre_assessment.session_id, sessionId)
      )
    );

  if (!row) return null;

  try {
    return {
      answers: JSON.parse(row.answers),
    };
  } catch {
    return null;
  }
}
export async function upsertPreAssessment(
  userId: string,
  sessionId: number, // (Uncomment as needed)
  answers: Record<string, number>
) {
  await db
    .insert(pre_assessment)
    .values({
      user_id: userId,
      // session_id: sessionId, // Uncomment if you include session_id in your schema
      answers: JSON.stringify(answers),
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        pre_assessment.user_id,
        // pre_assessment.session_id, // Uncomment if unique constraint includes session_id
      ],
      set: {
        answers: JSON.stringify(answers),
        updated_at: new Date(),
      },
    });
}

export async function getRiasecTest(
  userId: string
  // sessionId?: number  // optional if you use sessions
): Promise<{
  selectedAnswers: string[];
  interestCode: string;
  categoryCounts: {};
} | null> {
  const [row] = await db
    .select()
    .from(riasec_test)
    .where(eq(riasec_test.user_id, userId));
  if (!row) return null;

  try {
    return {
      selectedAnswers: JSON.parse(row.selected_answers),
      interestCode: row.interest_code,
      categoryCounts: row.category_counts,
    };
  } catch {
    return null;
  }
}
export async function upsertRiasecTest(
  userId: string,
  selectedAnswers: string[],
  categoryCounts: Record<string, number>,
  interestCode: string
) {
  await db
    .insert(riasec_test)
    .values({
      user_id: userId,
      selected_answers: JSON.stringify(selectedAnswers),
      category_counts: categoryCounts,
      interest_code: interestCode,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [riasec_test.user_id],
      set: {
        selected_answers: JSON.stringify(selectedAnswers),
        category_counts: categoryCounts,
        interest_code: interestCode,
        updated_at: new Date(),
      },
    });
}

export async function getPsychologicalWellbeingTest(
  userId: string
  // sessionId?: number,
): Promise<{
  answers: Record<string, string>;
  score: string;
  subscaleScores: Record<string, number>;
} | null> {
  const [row] = await db.select().from(psychological_wellbeing_test).where(
    // Use if sessionId is active
    // and(
    //   eq(personality_test.user_id, userId),
    //   eq(personality_test.session_id, sessionId)
    // )
    eq(psychological_wellbeing_test.user_id, userId)
  );

  if (!row) return null;

  try {
    return {
      answers: JSON.parse(row.answers),
      score: row.score,
      subscaleScores: row.subscale_scores,
    };
  } catch (error) {
    console.error("JSON parse error in getPsychologicalWellbeingTest:", error);
    return null;
  }
}

// export async function upsertPsychologicalWellbeingTest(
//   userId: string,
//   // sessionId: number,
//   score: number,
//   answers: Record<string, string>
// ) {
//   await db
//     .insert(psychological_wellbeing_test)
//     .values({
//       user_id: userId,
//       // session_id: sessionId,
//       answers: JSON.stringify(answers),
//       score,
//       created_at: new Date(),
//       updated_at: new Date(),
//     })
//     .onConflictDoUpdate({
//       target: [psychological_wellbeing_test.user_id], // or [personality_test.user_id, personality_test.session_id]
//       set: {
//         answers: JSON.stringify(answers),
//         score,
//         updated_at: new Date(),
//       },
//     });
// }

export async function upsertPsychologicalWellbeingTest(
  userId: string,
  score: number,
  answers: Record<string, string>,
  subscaleScores: Record<string, number> // JSON object for subscales
) {
  await db
    .insert(psychological_wellbeing_test)
    .values({
      user_id: userId,
      answers: JSON.stringify(answers),
      score,
      subscale_scores: subscaleScores,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [psychological_wellbeing_test.user_id], // or user_id + session_id if applicable
      set: {
        answers: JSON.stringify(answers),
        score,
        subscale_scores: subscaleScores,
        updated_at: new Date(),
      },
    });
}

export async function getPersonalityTest(
  userId: string
  // sessionId?: number,
): Promise<{
  answers: Record<string, string>;
  score: string;
  subscaleScores: Record<string, number>;
} | null> {
  const [row] = await db
    .select()
    .from(personality_test)
    .where(eq(personality_test.user_id, userId));

  if (!row) return null;

  try {
    return {
      answers: JSON.parse(row.answers),
      score: row.score,
      subscaleScores: row.subscale_scores,
    };
  } catch (error) {
    console.error("JSON parse error in getPersonalityTest:", error);
    return null;
  }
}

// export async function upsertPersonalityTest(
//   userId: string,
//   // sessionId: number,
//   score: number,
//   answers: Record<string, string>
// ) {
//   await db
//     .insert(personality_test)
//     .values({
//       user_id: userId,
//       // session_id: sessionId,
//       answers: JSON.stringify(answers),
//       score,
//       created_at: new Date(),
//       updated_at: new Date(),
//     })
//     .onConflictDoUpdate({
//       target: [personality_test.user_id], // or [personality_test.user_id, personality_test.session_id]
//       set: {
//         answers: JSON.stringify(answers),
//         score,
//         updated_at: new Date(),
//       },
//     });
// }

export async function upsertPersonalityTest(
  userId: string,
  // sessionId: number, // uncomment if you track sessions
  score: number,
  answers: Record<string, string>,
  subscaleScores: Record<string, number>
) {
  await db
    .insert(personality_test)
    .values({
      user_id: userId,
      // session_id: sessionId,
      answers: JSON.stringify(answers),
      score,
      subscale_scores: subscaleScores,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [personality_test.user_id], // or include session_id if used
      set: {
        answers: JSON.stringify(answers),
        score,
        subscale_scores: subscaleScores,
        updated_at: new Date(),
      },
    });
}

// Career Story Board Functions
export async function getCareerStoryBoard(userId: string, sessionId: number) {
  try {
    const [result] = await db
      .select()
      .from(career_story_boards)
      .where(
        and(
          eq(career_story_boards.user_id, userId),
          eq(career_story_boards.session_id, sessionId)
        )
      )
      .limit(1);

    if (!result) return null;

    // Parse the JSON sticky_notes back to object
    return {
      ...result,
      stickyNotes: result.sticky_notes,
    };
  } catch (error) {
    console.error("Error fetching career story board:", error);
    throw error;
  }
}

export async function upsertCareerStoryBoard(
  userId: string,
  sessionId: number,
  data: { stickyNotes: any[] }
) {
  try {
    const stickyNotesJson = JSON.stringify(data.stickyNotes);

    await db
      .insert(career_story_boards)
      .values({
        user_id: userId,
        session_id: sessionId,
        sticky_notes: stickyNotesJson,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: [career_story_boards.user_id, career_story_boards.session_id],
        set: {
          sticky_notes: stickyNotesJson,
          updated_at: new Date(),
        },
      });

    console.log("Career story board saved successfully");
  } catch (error) {
    console.error("Error upserting career story board:", error);
    throw error;
  }
}

// Add these functions to your existing queries.ts file

// Get daily journaling data for a user and session
export async function getDailyJournaling(
  userId: string,
  sessionId: number
): Promise<DailyJournalingData | null> {
  try {
    const result = await db
      .select()
      .from(dailyJournalingTable)
      .where(
        and(
          eq(dailyJournalingTable.userId, userId),
          eq(dailyJournalingTable.sessionId, sessionId)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];

    // Parse JSON fields safely
    return {
      date: data.date,
      tookAction: data.tookAction as "yes" | "no" | "",
      whatHeldBack: data.whatHeldBack || "",
      challenges: data.challenges ? JSON.parse(data.challenges) : [],
      progress: data.progress ? JSON.parse(data.progress) : [],
      gratitude: data.gratitude ? JSON.parse(data.gratitude) : [],
      gratitudeHelp: data.gratitudeHelp ? JSON.parse(data.gratitudeHelp) : [],
      tomorrowStep: data.tomorrowStep || "",
    };
  } catch (error) {
    console.error("Error getting daily journaling:", error);
    throw error;
  }
}

// Upsert daily journaling data
export async function upsertDailyJournaling(
  userId: string,
  sessionId: number,
  data: DailyJournalingData
): Promise<void> {
  try {
    // Check if record exists
    const existing = await db
      .select({ id: dailyJournalingTable.id })
      .from(dailyJournalingTable)
      .where(
        and(
          eq(dailyJournalingTable.userId, userId),
          eq(dailyJournalingTable.sessionId, sessionId)
        )
      )
      .limit(1);

    const journalData = {
      userId,
      sessionId,
      date: data.date,
      tookAction: data.tookAction || "",
      whatHeldBack: data.whatHeldBack || "",
      challenges: JSON.stringify(data.challenges || []),
      progress: JSON.stringify(data.progress || []),
      gratitude: JSON.stringify(data.gratitude || []),
      gratitudeHelp: JSON.stringify(data.gratitudeHelp || []),
      tomorrowStep: data.tomorrowStep || "",
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      // Update existing record
      await db
        .update(dailyJournalingTable)
        .set(journalData)
        .where(
          and(
            eq(dailyJournalingTable.userId, userId),
            eq(dailyJournalingTable.sessionId, sessionId)
          )
        );
    } else {
      // Insert new record
      await db.insert(dailyJournalingTable).values({
        ...journalData,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error upserting daily journaling:", error);
    throw error;
  }
}

export async function getCareerStoryTwo(
  userId: string,
  sessionId: number
): Promise<CareerStoryTwoData | null> {
  try {
    const result = await db
      .select()
      .from(careerStoryTwo)
      .where(
        and(
          eq(careerStoryTwo.userId, userId),
          eq(careerStoryTwo.sessionId, sessionId)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];
    return {
      firstAdjectives: data.firstAdjectives,
      repeatedWords: data.repeatedWords,
      commonTraits: data.commonTraits,
      significantWords: data.significantWords,
      selfStatement: data.selfStatement,
      mediaActivities: data.mediaActivities,
      selectedRiasec: data.selectedRiasec,
      settingStatement: data.settingStatement,
    };
  } catch (error) {
    console.error("Error fetching career story two:", error);
    throw error;
  }
}

export async function upsertCareerStoryTwo(
  userId: string,
  sessionId: number,
  data: CareerStoryTwoData
): Promise<void> {
  try {
    const existingRecord = await db
      .select()
      .from(careerStoryTwo)
      .where(
        and(
          eq(careerStoryTwo.userId, userId),
          eq(careerStoryTwo.sessionId, sessionId)
        )
      )
      .limit(1);

    const recordData = {
      userId,
      sessionId,
      firstAdjectives: data.firstAdjectives,
      repeatedWords: data.repeatedWords,
      commonTraits: data.commonTraits,
      significantWords: data.significantWords,
      selfStatement: data.selfStatement,
      mediaActivities: data.mediaActivities,
      selectedRiasec: data.selectedRiasec,
      settingStatement: data.settingStatement,
      updatedAt: new Date(),
    };

    if (existingRecord.length > 0) {
      // Update existing record
      await db
        .update(careerStoryTwo)
        .set(recordData)
        .where(
          and(
            eq(careerStoryTwo.userId, userId),
            eq(careerStoryTwo.sessionId, sessionId)
          )
        );
    } else {
      // Insert new record
      await db.insert(careerStoryTwo).values({
        ...recordData,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error upserting career story two:", error);
    throw error;
  }
}

export async function getCareerStoryThree(
  userId: string,
  sessionId: number
): Promise<CareerStoryThreeData | null> {
  try {
    const result = await db
      .select()
      .from(careerStoryThree)
      .where(
        and(
          eq(careerStoryThree.userId, userId),
          eq(careerStoryThree.sessionId, sessionId)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];
    return {
      selfStatement: data.selfStatement,
      settingStatement: data.settingStatement,
      plotDescription: data.plotDescription,
      plotActivities: data.plotActivities,
      ableToBeStatement: data.ableToBeStatement,
      placesWhereStatement: data.placesWhereStatement,
      soThatStatement: data.soThatStatement,
      mottoStatement: data.mottoStatement,
      selectedOccupations: data.selectedOccupations,
    };
  } catch (error) {
    console.error("Error fetching career story three:", error);
    throw error;
  }
}

export async function upsertCareerStoryThree(
  userId: string,
  sessionId: number,
  data: CareerStoryThreeData
): Promise<void> {
  try {
    await db
      .insert(careerStoryThree)
      .values({
        userId,
        sessionId,
        selfStatement: data.selfStatement,
        settingStatement: data.settingStatement,
        plotDescription: data.plotDescription,
        plotActivities: data.plotActivities,
        ableToBeStatement: data.ableToBeStatement,
        placesWhereStatement: data.placesWhereStatement,
        soThatStatement: data.soThatStatement,
        mottoStatement: data.mottoStatement,
        selectedOccupations: data.selectedOccupations,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [careerStoryThree.userId, careerStoryThree.sessionId],
        set: {
          selfStatement: data.selfStatement,
          settingStatement: data.settingStatement,
          plotDescription: data.plotDescription,
          plotActivities: data.plotActivities,
          ableToBeStatement: data.ableToBeStatement,
          placesWhereStatement: data.placesWhereStatement,
          soThatStatement: data.soThatStatement,
          mottoStatement: data.mottoStatement,
          selectedOccupations: data.selectedOccupations,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error("Error upserting career story three:", error);
    throw error;
  }
}

// Add these functions to your existing queries.ts file

export async function getLetterFromFutureSelf(
  userId: string,
  sessionId: number
) {
  const result = await db.query.letterFromFutureSelfTable.findFirst({
    where: and(
      eq(letterFromFutureSelfTable.userId, userId),
      eq(letterFromFutureSelfTable.sessionId, sessionId)
    ),
  });

  return result;
}

export async function upsertLetterFromFutureSelf(
  userId: string,
  sessionId: number,
  data: {
    letter: string;
  }
) {
  await db
    .insert(letterFromFutureSelfTable)
    .values({
      userId,
      sessionId,
      letter: data.letter,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        letterFromFutureSelfTable.userId,
        letterFromFutureSelfTable.sessionId,
      ],
      set: {
        letter: data.letter,
        updatedAt: new Date(),
      },
    });
}

export async function getCareerOptionsMatrix(
  userId: string,
  sessionId: number
) {
  try {
    const result = await db
      .select()
      .from(careerOptionsMatrix)
      .where(
        and(
          eq(careerOptionsMatrix.userId, userId),
          eq(careerOptionsMatrix.sessionId, sessionId)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];

    // Return the data in the expected format
    return {
      rows: data.rows,
      columns: data.columns,
      cells: data.cells,
    };
  } catch (error) {
    console.error("Error getting career options matrix:", error);
    throw error;
  }
}

// Upsert Career Options Matrix
export async function upsertCareerOptionsMatrix(
  userId: string,
  sessionId: number,
  data: CareerOptionsMatrixData
) {
  try {
    const existingRecord = await db
      .select({ id: careerOptionsMatrix.id })
      .from(careerOptionsMatrix)
      .where(
        and(
          eq(careerOptionsMatrix.userId, userId),
          eq(careerOptionsMatrix.sessionId, sessionId)
        )
      )
      .limit(1);

    if (existingRecord.length > 0) {
      // Update existing record
      await db
        .update(careerOptionsMatrix)
        .set({
          rows: data.rows,
          columns: data.columns,
          cells: data.cells,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(careerOptionsMatrix.userId, userId),
            eq(careerOptionsMatrix.sessionId, sessionId)
          )
        );
    } else {
      // Insert new record
      await db.insert(careerOptionsMatrix).values({
        userId,
        sessionId,
        rows: data.rows,
        columns: data.columns,
        cells: data.cells,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error upserting career options matrix:", error);
    throw error;
  }
}

export async function getCareerStoryFour(
  userId: string,
  sessionId: number
): Promise<CareerStoryFour | null> {
  try {
    const [result] = await db
      .select({
        rewrittenStory: careerStoryFours.rewrittenStory,
      })
      .from(careerStoryFours)
      .where(
        and(
          eq(careerStoryFours.userId, userId),
          eq(careerStoryFours.sessionId, sessionId)
        )
      )
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      rewrittenStory: result.rewrittenStory,
    };
  } catch (error) {
    console.error("Error fetching career story four:", error);
    throw new Error("Failed to fetch career story four");
  }
}

// Upsert career story four data
export async function upsertCareerStoryFour(
  userId: string,
  sessionId: number,
  data: CareerStoryFour
): Promise<void> {
  try {
    await db
      .insert(careerStoryFours)
      .values({
        userId,
        sessionId,
        rewrittenStory: data.rewrittenStory,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [careerStoryFours.userId, careerStoryFours.sessionId],
        set: {
          rewrittenStory: data.rewrittenStory,
          updatedAt: new Date(),
        },
      });

    console.log("Career story four upserted successfully");
  } catch (error) {
    console.error("Error upserting career story four:", error);
    throw new Error("Failed to save career story four");
  }
}

export async function getCareerStoryOne(
  userId: string,
  sessionId: number
): Promise<CareerStoryOneData | null> {
  try {
    const result = await db.query.careerStoryOneTable.findFirst({
      where: and(
        eq(careerStoryOneTable.userId, userId),
        eq(careerStoryOneTable.sessionId, sessionId)
      ),
    });

    if (!result) {
      return null;
    }

    return {
      transitionEssay: result.transitionEssay,
      occupations: result.occupations,
      heroes: result.heroes as Array<{
        id: string;
        title: string;
        description: string;
      }>,
    };
  } catch (error) {
    console.error("Error getting career story one:", error);
    return null;
  }
}

export async function upsertCareerStoryOne(
  userId: string,
  sessionId: number,
  data: CareerStoryOneData
): Promise<void> {
  try {
    await db
      .insert(careerStoryOneTable)
      .values({
        userId,
        sessionId,
        transitionEssay: data.transitionEssay,
        occupations: data.occupations,
        heroes: data.heroes,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [careerStoryOneTable.userId, careerStoryOneTable.sessionId],
        set: {
          transitionEssay: data.transitionEssay,
          occupations: data.occupations,
          heroes: data.heroes,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error("Error upserting career story one:", error);
    throw error;
  }
}

export async function getMyLifeCollage(userId: string, sessionId: number) {
  try {
    const result = await db
      .select()
      .from(myLifeCollageTable)
      .where(
        and(
          eq(myLifeCollageTable.userId, userId),
          eq(myLifeCollageTable.sessionId, sessionId)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];

    return {
      presentLifeCollage: data.presentLifeCollage || [],
      futureLifeCollage: data.futureLifeCollage || [],
      retirementValues: data.retirementValues || "",
    };
  } catch (error) {
    console.error("Error fetching my life collage:", error);
    throw error;
  }
}

// Upsert my life collage data
export async function upsertMyLifeCollage(
  userId: string,
  sessionId: number,
  data: LifeCollageFormData
) {
  try {
    const result = await db
      .insert(myLifeCollageTable)
      .values({
        userId,
        sessionId,
        presentLifeCollage: data.presentLifeCollage,
        futureLifeCollage: data.futureLifeCollage,
        retirementValues: data.retirementValues,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [myLifeCollageTable.userId, myLifeCollageTable.sessionId],
        set: {
          presentLifeCollage: data.presentLifeCollage,
          futureLifeCollage: data.futureLifeCollage,
          retirementValues: data.retirementValues,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error upserting my life collage:", error);
    throw error;
  }
}

export async function upsertPostCareerMaturityAssessment(
  userId: string,
  sessionId: number,
  answers: Record<string, string>
) {
  await db
    .insert(postCareerMaturityTable)
    .values({
      user_id: userId,
      answers: answers,
    })
    .onConflictDoUpdate({
      target: [postCareerMaturityTable.user_id],
      set: {
        answers: answers,
        updated_at: sql`CURRENT_TIMESTAMP`,
      },
    });
}

export async function getPostCareerMaturityAssessment(
  userId: string,
  sessionId: number
) {
  const result = await db
    .select()
    .from(postCareerMaturityTable)
    .where(eq(postCareerMaturityTable.user_id, userId))
    .limit(1);

  if (!result[0]) return null;

  return result[0]; // No need to parse for jsonb
}

// Add these functions to your queries.ts file
export async function getPostPsychologicalWellbeingTest(
  userId: string,
  sessionId: number
): Promise<{
  answers: Record<string, string>;
  score: string;
  subscaleScores: Record<string, number>;
} | null> {
  const [row] = await db
    .select()
    .from(post_psychological_wellbeing_test)
    .where(
      and(
        eq(post_psychological_wellbeing_test.user_id, userId),
        eq(post_psychological_wellbeing_test.session_id, sessionId)
      )
    );
  if (!row) return null;
  try {
    return {
      answers: JSON.parse(row.answers),
      score: row.score,
      subscaleScores: row.subscale_scores,
    };
  } catch (error) {
    console.error(
      "JSON parse error in getPostPsychologicalWellbeingTest:",
      error
    );
    return null;
  }
}

export async function upsertPostPsychologicalWellbeingTest(
  userId: string,
  sessionId: number,
  score: number,
  answers: Record<string, string>,
  subscaleScores: Record<string, number>
) {
  await db
    .insert(post_psychological_wellbeing_test)
    .values({
      user_id: userId,
      session_id: sessionId,
      answers: JSON.stringify(answers),
      score,
      subscale_scores: subscaleScores,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        post_psychological_wellbeing_test.user_id,
        post_psychological_wellbeing_test.session_id,
      ],
      set: {
        answers: JSON.stringify(answers),
        score,
        subscale_scores: subscaleScores,
        updated_at: new Date(),
      },
    });
}

export async function getPostCoachingAssessment(
  userId: string,
  sessionId: number
) {
  try {
    const result = await db
      .select()
      .from(postCoachingAssessments)
      .where(
        and(
          eq(postCoachingAssessments.userId, userId),
          eq(postCoachingAssessments.sessionId, sessionId)
        )
      )
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching post-coaching assessment:", error);
    throw error;
  }
}

export async function upsertPostCoachingAssessment(
  userId: string,
  sessionId: number,
  answers: Record<string, number>
) {
  try {
    const result = await db
      .insert(postCoachingAssessments)
      .values({
        userId,
        sessionId,
        answers,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          postCoachingAssessments.userId,
          postCoachingAssessments.sessionId,
        ],
        set: {
          answers,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error upserting post-coaching assessment:", error);
    throw error;
  }
}
