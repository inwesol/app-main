"use client";

import React, { useState, useEffect } from "react";
import { User, Brain, Heart, Zap, Target, Award } from "lucide-react";
import Header from "@/components/form-components/header";
import Slider from "@/components/form-components/slider";
import ProgressBar from "./../../components/form-components/progress-bar";
import { Card, CardHeader } from "@/components/ui/card";
import PageNavigation from "@/components/form-components/page-navigation";
import PreviousButton from "./../../components/form-components/previous-button";
import NextButton from "@/components/form-components/next-button";

interface Question {
  id: number;
  text: string;
  lowLabel: string;
  highLabel: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Is talkative",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 2,
    text: "Tends to find fault with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 3,
    text: "Does a thorough job",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 4,
    text: "Is depressed, blue",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 5,
    text: "Is original, comes up with new ideas",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 6,
    text: "Is reserved",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 7,
    text: "Is helpful and unselfish with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 8,
    text: "Can be somewhat careless",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 9,
    text: "Is relaxed, handles stress well",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 10,
    text: "Is curious about many different things",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 11,
    text: "Is full of energy",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 12,
    text: "Starts quarrels with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 13,
    text: "Is a reliable worker",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 14,
    text: "Can be tense",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 15,
    text: "Is ingenious, a deep thinker",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 16,
    text: "Generates a lot of enthusiasm",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 17,
    text: "Has a forgiving nature",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 18,
    text: "Tends to be disorganized",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 19,
    text: "Worries a lot",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 20,
    text: "Has an active imagination",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 21,
    text: "Tends to be quiet",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 22,
    text: "Is generally trusting",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 23,
    text: "Tends to be lazy",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 24,
    text: "Is emotionally stable, not easily upset",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 25,
    text: "Is inventive",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 26,
    text: "Has an assertive personality",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 27,
    text: "Can be cold and aloof",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 28,
    text: "Perseveres until the task is finished",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 29,
    text: "Can be moody",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 30,
    text: "Values artistic, aesthetic experiences",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 31,
    text: "Is sometimes shy, inhibited",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 32,
    text: "Is considerate and kind to almost everyone",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 33,
    text: "Does things efficiently",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 34,
    text: "Remains calm in tense situations",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 35,
    text: "Prefers work that is routine",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 36,
    text: "Is outgoing, sociable",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 37,
    text: "Is sometimes rude to others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 38,
    text: "Makes plans and follows through with them",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 39,
    text: "Gets nervous easily",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 40,
    text: "Likes to reflect, play with ideas",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 41,
    text: "Has few artistic interests",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 42,
    text: "Likes to cooperate with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 43,
    text: "Is easily distracted",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 44,
    text: "Is sophisticated in art, music, or literature",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
];

// group questions into different pages
const questionPages = [
  {
    title: "Social & Communication Style",
    description:
      "Questions about how you interact with others and express yourself",
    questions: questions.slice(0, 9),
    icon: Zap,
    color: "orange",
  },
  {
    title: "Work Style & Organization",
    description: "Questions about your approach to tasks and responsibilities",
    questions: questions.slice(9, 18),
    icon: Target,
    color: "primary-blue",
  },
  {
    title: "Emotional Patterns & Stress",
    description:
      "Questions about your emotional responses and stress management",
    questions: questions.slice(18, 27),
    icon: Brain,
    color: "purple",
  },
  {
    title: "Creativity & Openness",
    description: "Questions about your openness to new experiences and ideas",
    questions: questions.slice(27, 36),
    icon: User,
    color: "primary-green",
  },
  {
    title: "Relationships & Cooperation",
    description: "Questions about how you relate to and work with others",
    questions: questions.slice(36, 44),
    icon: Heart,
    color: "pink",
  },
];

const PersonalityTest: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState(initialFormData());

  function initialFormData(): { [key: string]: number } {
    return questions.reduce((acc, currElem) => {
      acc[currElem.text] = 3;
      return acc;
    }, {} as { [key: string]: number });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleResponse = (question: string, value: number) => {
    console.log("running");
    setFormData((prev) => ({
      ...prev,
      [question]: value,
    }));
  };
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage < questionPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleSubmit = () => {
    console.log(formData);
  };
  const currentPageData = questionPages[currentPage];
  const progressPercentage = ((currentPage + 1) / questionPages.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header
          headerIcon={User}
          headerText="Big Five Personality Test"
          headerDescription="Discover your personality across five key dimensions. Rate how much
            you agree with each statement about yourself."
        />

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              Page {currentPage + 1} of {questionPages.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <ProgressBar progressPercentage={progressPercentage} />
        </div>

        {/* Page Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
          {questionPages.map((page, index) => (
            <PageNavigation
              key={index}
              index={index}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          ))}
        </div>

        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
          {/* Page Header */}
          <CardHeader className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-t-2xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className={`size-10 sm:size-12 bg-gradient-to-br from-${currentPageData.color}-500 to-${currentPageData.color}-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <currentPageData.icon className="size-5 sm:size-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                  {currentPageData.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {currentPageData.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Questions for current page */}
              {currentPageData.questions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                >
                  {/* Question */}
                  <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                      <span className="text-base sm:text-lg font-bold text-slate-500">
                        Q{question.id}
                      </span>
                      <h4 className="text-base sm:text-lg text-slate-800 leading-relaxed">
                        I see myself as someone who...
                        <span className="font-semibold">
                          &quot;{question.text}&quot;
                        </span>
                      </h4>
                    </div>
                  </div>

                  {/* Integrated Slider */}
                  <Slider
                    currentQuestionData={question}
                    value={formData[question.text]}
                    onChange={handleResponse}
                    from="personalityTest"
                    min="1"
                    max="5"
                  />
                </div>
              ))}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <PreviousButton
                  onClicking={prevPage}
                  currentPage={currentPage}
                />

                {currentPage === questionPages.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                  >
                    Complete Assessment
                    <Award className="size-5 group-hover:rotate-12 transition-transform duration-200" />
                  </button>
                ) : (
                  <NextButton onClicking={nextPage} />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalityTest;
