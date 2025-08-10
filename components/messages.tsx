import type { UIMessage } from "ai";
import { PreviewMessage, ThinkingMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { Greeting } from "./greeting";
import { memo, useState, useEffect } from "react";
import type { Vote } from "@/lib/db/schema";
import equal from "fast-deep-equal";
import type { UseChatHelpers } from "@ai-sdk/react";

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers["status"];
  votes: Array<Vote> | undefined;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
}

interface FeedbackCardProps {
  onFeedback: (rating: number, comment?: string) => void;
  onDismiss: () => void;
}

const StarRating = ({
  rating,
  onRatingChange,
  size = 24,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-colors"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={(hoverRating || rating) >= star ? "#fbbf24" : "none"}
            stroke={(hoverRating || rating) >= star ? "#fbbf24" : "#d1d5db"}
            strokeWidth="2"
            className="transition-colors"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const FeedbackCard = ({ onFeedback, onDismiss }: FeedbackCardProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onFeedback(rating, comment.trim() || undefined);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-3xl px-4 mb-6">
      <div className="bg-blue-50 border-2 border-green-400 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            How would you rate your experience?
          </h3>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <StarRating rating={rating} onRatingChange={setRating} size={32} />
            <div className="text-sm text-gray-600">
              {rating === 1}
              {rating === 2}
              {rating === 3}
              {rating === 4}
              {rating === 5}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional feedback (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="px-4 py-2 bg-green-500 hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function PureMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Check if we should show feedback after 4 user messages
  useEffect(() => {
    const userMessageCount = messages.filter((m) => m.role === "user").length;

    console.log("User message count:", userMessageCount); // Debug log

    // Show feedback after user's 4th message
    if (
      userMessageCount >= 4 &&
      !feedbackSubmitted &&
      !isReadonly &&
      !showFeedback
    ) {
      console.log("Showing feedback form"); // Debug log
      // Small delay to let the conversation settle
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, feedbackSubmitted, isReadonly, showFeedback]);

  const handleFeedback = async (rating: number, comment?: string) => {
    try {
      console.log("Submitting feedback:", { rating, comment }); // Debug log

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          rating,
          comment,
          messageCount: messages.length,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Don't display response, just mark as submitted
      setFeedbackSubmitted(true);
      setShowFeedback(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error; // Re-throw to handle in the component
    }
  };

  const handleDismissFeedback = () => {
    setShowFeedback(false);
    setFeedbackSubmitted(true); // Mark as submitted to prevent showing again
  };

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      {/* Show feedback card after 4 user messages */}
      {showFeedback && (
        <FeedbackCard
          onFeedback={handleFeedback}
          onDismiss={handleDismissFeedback}
        />
      )}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
