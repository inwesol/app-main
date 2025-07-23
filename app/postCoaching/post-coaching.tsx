"use client";

import { useState } from "react";
import {
  Target,
  TrendingUp,
  Shield,
  Brain,
  Scale as Balance,
  Heart,
  Zap,
  CheckCircle,
  BarChart3,
  Award,
  Lightbulb,
  Users,
  Star,
  ThumbsUp,
  BarChart,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/form-components/header";
import { Card, CardHeader } from "@/components/ui/card";
import ProgressBar from "@/components/form-components/progress-bar";
import PageNavigation from "@/components/form-components/page-navigation";
import PreviousButton from "@/components/form-components/previous-button";
import NextButton from "@/components/form-components/next-button";

// Post-Coaching Question Configuration
const questions = [
  {
    title: "Career Goals Clarity",
    question: "How clear are your career goals after coaching?",
    icon: Target,
    color: "primary-blue",
    lowLabel: "Not at all clear",
    highLabel: "Completely clear",
    description:
      "Rate how well-defined and specific your career objectives are now",
  },
  {
    title: "Achievement Confidence",
    question:
      "How confident are you that you will achieve your career goals after coaching?",
    icon: TrendingUp,
    color: "primary-green",
    lowLabel: "Not at all confident",
    highLabel: "Extremely confident",
    description:
      "Assess your belief in your ability to reach your career aspirations post-coaching",
  },
  {
    title: "Obstacle Resilience",
    question:
      "How confident are you in your ability to overcome obstacles in your career after coaching?",
    icon: Shield,
    color: "purple",
    lowLabel: "Not at all confident",
    highLabel: "Extremely confident",
    description:
      "Rate your resilience and problem-solving confidence after coaching",
  },
  {
    title: "Stress Management",
    question:
      "How would you rate your level of stress related to work or personal life after coaching?",
    icon: Brain,
    color: "orange",
    lowLabel: "Extremely high",
    highLabel: "Very low",
    description:
      "Assess your current stress levels and coping mechanisms post-coaching",
    reversed: true,
  },
  {
    title: "Self-Awareness",
    question:
      "How well do you understand your own thought patterns and behaviors after coaching?",
    icon: Lightbulb,
    color: "primary-blue",
    lowLabel: "Not at all",
    highLabel: "Completely",
    description:
      "Rate your level of self-awareness and introspection after coaching",
  },
  {
    title: "Work-Life Balance",
    question:
      "How satisfied are you with your work-life balance after coaching?",
    icon: Balance,
    color: "primary-green",
    lowLabel: "Not at all satisfied",
    highLabel: "Extremely satisfied",
    description:
      "Evaluate how well you balance professional and personal commitments post-coaching",
  },
  {
    title: "Overall Well-being",
    question:
      "How satisfied are you with your job and overall well-being after coaching?",
    icon: Heart,
    color: "purple",
    lowLabel: "Not at all satisfied",
    highLabel: "Extremely satisfied",
    description:
      "Rate your overall contentment with work and life satisfaction after coaching",
  },
  {
    title: "Change Readiness",
    question:
      "How ready are you to make changes in your professional or personal life after coaching?",
    icon: Zap,
    color: "orange",
    lowLabel: "Not at all ready",
    highLabel: "Completely ready",
    description:
      "Assess your motivation and readiness for transformation post-coaching",
  },
  {
    title: "Coaching Experience",
    question:
      "How would you rate your overall experience with the coaching process?",
    icon: Star,
    color: "primary-blue",
    lowLabel: "Very poor",
    highLabel: "Excellent",
    description: "Evaluate your overall experience with the coaching",
  },
  {
    title: "Coach Relationship Effectiveness",
    question: "How effective was the relationship between you and your coach?",
    icon: Users,
    color: "primary-green",
    lowLabel: "Not at all effective",
    highLabel: "Extremely effective",
    description: "Rate the effectiveness of the coach-client relationship",
  },
  {
    title: "Coach Support",
    question: "Did you feel supported and understood by your coach?",
    icon: ThumbsUp,
    color: "purple",
    lowLabel: "Not at all supported",
    highLabel: "Completely supported",
    description: "Assess how supported and understood you felt during coaching",
  },
  {
    title: "Current Strength Usage",
    question:
      "How much do you currently feel that you are using your strengths in your career?",
    icon: BarChart,
    color: "primary-blue",
    lowLabel: "Not at all",
    highLabel: "Completely",
    description:
      "Evaluate your current usage of strengths in your professional life",
  },
  {
    title: "Improved Strength Usage",
    question:
      "How much more do you feel that you are using your strengths in your career after coaching?",
    icon: ArrowUpRight,
    color: "primary-green",
    lowLabel: "Not at all",
    highLabel: "Completely",
    description:
      "Rate the improvement in utilizing your strengths due to coaching",
  },
];

export function PostCoachingTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState(initialFormData());
  function initialFormData(): { [key: string]: number } {
    return questions.reduce((acc, currElem) => {
      acc[currElem.question] = 5;
      return acc;
    }, {} as { [key: string]: number });
  }
  const handleSliderChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  const handleSubmit = () => {
    console.log("Assessment Results:", formData);
    setIsCompleted(true);
  };

  const getValueText = (value: number, question: (typeof questions)[0]) => {
    if (question.reversed) {
      if (value <= 3) return "High Stress";
      if (value <= 6) return "Moderate";
      return "Low Stress";
    } else {
      if (value <= 3) return "Low";
      if (value <= 6) return "Moderate";
      return "High";
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const currentValue = formData[currentQuestionData.question];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <CheckCircle className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Assessment Complete!
            </h2>
            <p className="text-slate-600">
              Thank you for completing the pre-coaching assessment.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Header
          headerIcon={BarChart3}
          headerText=" Post-Coaching Assessment"
          headerDescription="This assessment will help us understand your current state and readiness
        for coaching. Please answer honestly based on how you feel right now."
        />

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <ProgressBar progressPercentage={progressPercentage} />
        </div>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
          {questions.map((_, index) => (
            <PageNavigation
              key={index}
              index={index}
              currentPage={currentQuestion}
              setCurrentPage={setCurrentQuestion}
            />
          ))}
        </div>

        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-t-2xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className={`size-14 bg-gradient-to-br from-${currentQuestionData.color}-500 to-${currentQuestionData.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <currentQuestionData.icon className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                  {currentQuestionData.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {currentQuestionData.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <div className="sm:p-6 p-8">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex gap-2 mb-2">
                  <span className="text-base sm:text-lg font-bold text-slate-500">
                    Q{currentQuestion + 1}
                  </span>
                  <h4 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                    {currentQuestionData.question}
                  </h4>
                </div>
                {/* range component */}
                <div className="space-y-6 sm:p-6 p-4 bg-gradient-to-br from-primary-green-50 to-primary-green-100 rounded-2xl border-2 border-slate-200 shadow-md">
                  {/* Custom Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentValue}
                      onChange={(e) =>
                        handleSliderChange(
                          currentQuestionData.question,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #10b981 ${
                          ((currentValue - 1) / 9) * 100
                        }%, #e2e8f0 ${
                          ((currentValue - 1) / 9) * 100
                        }%, #e2e8f0 100%)`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2 ">
                    <div className="text-center">
                      <div className="font-semibold text-slate-600 text-sm">
                        {currentQuestionData.lowLabel}
                      </div>
                      <div className="text-slate-500 text-xs">(1)</div>
                    </div>

                    <div className="text-center sm:px-6 sm:py-3 px-3 py-1 rounded-xl bg-white/80 shadow-md text-primary-blue-600">
                      <div className="font-bold text-xl sm:text-3xl">
                        {currentValue}/10
                      </div>
                      <div className="font-semibold text-sm">
                        {getValueText(currentValue, currentQuestionData)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-semibold text-slate-600 text-sm">
                        {currentQuestionData.highLabel}
                      </div>
                      <div className="text-slate-500 text-xs">(10)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <PreviousButton
                  onClicking={prevQuestion}
                  currentPage={currentQuestion}
                />

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
                  >
                    Complete Assessment
                    <Award className="size-5 group-hover:rotate-12 transition-transform duration-200" />
                  </button>
                ) : (
                  <NextButton onClicking={nextQuestion} />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
