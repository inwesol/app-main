"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Brain,
  Target,
  Users,
  Compass,
  Award,
  Lightbulb,
  Shield,
  Smile,
} from "lucide-react";
import Header from "@/components/form-components/header";
import ProgressBar from "@/components/form-components/progress-bar";
import PageNavigation from "@/components/form-components/page-navigation";
import { Card, CardHeader } from "@/components/ui/card";
import Slider from "@/components/form-components/slider";
import PreviousButton from "@/components/form-components/previous-button";
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
    text: "I am not afraid to voice my opinions, even when they are in opposition to the opinions of most people.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 2,
    text: "For me, life has been a continuous process of learning, changing, and growth.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 3,
    text: "In general, I feel I am in charge of the situation in which I live.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 4,
    text: "People would describe me as a giving person, willing to share my time with others.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 5,
    text: "I am not interested in activities that will expand my horizons.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 6,
    text: "I enjoy making plans for the future and working to make them a reality.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 7,
    text: "Most people see me as loving and affectionate.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 8,
    text: "In many ways I feel disappointed about my achievements in life.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 9,
    text: "I live life one day at a time and don't really think about the future.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 10,
    text: "I tend to worry about what other people think of me.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 11,
    text: "When I look at the story of my life, I am pleased with how things have turned out.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 12,
    text: "I have difficulty arranging my life in a way that is satisfying to me.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 13,
    text: "My decisions are not usually influenced by what everyone else is doing.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 14,
    text: "I gave up trying to make big improvements or changes in my life a long time ago.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 15,
    text: "The demands of everyday life often get me down.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 16,
    text: "I have not experienced many warm and trusting relationships with others.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 17,
    text: "I think it is important to have new experiences that challenge how you think about yourself and the world.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 18,
    text: "Maintaining close relationships has been difficult and frustrating for me.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 19,
    text: "My attitude about myself is probably not as positive as most people feel about themselves.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 20,
    text: "I have a sense of direction and purpose in life.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 21,
    text: "I judge myself by what I think is important, not by the values of what others think is important.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 22,
    text: "In general, I feel confident and positive about myself.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 23,
    text: "I have been able to build a living environment and a lifestyle for myself that is much to my liking.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 24,
    text: "I tend to be influenced by people with strong opinions.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 25,
    text: "I do not enjoy being in new situations that require me to change my old familiar ways of doing things.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 26,
    text: "I do not fit very well with the people and the community around me.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 27,
    text: "I know that I can trust my friends, and they know they can trust me.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 28,
    text: "When I think about it, I haven't really improved much as a person over the years.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 29,
    text: "Some people wander aimlessly through life, but I am not one of them.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 30,
    text: "I often feel lonely because I have few close friends with whom to share my concerns.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 31,
    text: "When I compare myself to friends and acquaintances, it makes me feel good about who I am.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 32,
    text: "I don't have a good sense of what it is I'm trying to accomplish in life.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 33,
    text: "I sometimes feel as if I've done all there is to do in life.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 34,
    text: "I feel like many of the people I know have gotten more out of life than I have.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 35,
    text: "I have confidence in my opinions, even if they are contrary to the general consensus.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 36,
    text: "I am quite good at managing the many responsibilities of my daily life.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 37,
    text: "I have the sense that I have developed a lot as a person over time.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 38,
    text: "I enjoy personal and mutual conversations with family members and friends.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 39,
    text: "My daily activities often seem trivial and unimportant to me.",

    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 40,
    text: "I like most parts of my personality.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 41,
    text: "It's difficult for me to voice my own opinions on controversial matters.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 42,
    text: "I often feel overwhelmed by my responsibilities.",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
];
// Group questions into logical pages
const questionPages = [
  {
    title: "Self-Direction & Independence",
    description: "Questions about your autonomy and self-determination",
    questions: questions.slice(0, 7),
    icon: Shield,
    color: "primary-blue",
  },
  {
    title: "Life Management & Control",
    description:
      "Questions about managing your environment and responsibilities",
    questions: questions.slice(7, 14),
    icon: Target,
    color: "primary-green",
  },
  {
    title: "Growth & Development",
    description: "Questions about personal growth and openness to experiences",
    questions: questions.slice(14, 21),
    icon: Lightbulb,
    color: "primary-blue",
  },
  {
    title: "Relationships & Connection",
    description: "Questions about your relationships and social connections",
    questions: questions.slice(21, 28),
    icon: Users,
    color: "primary-green",
  },
  {
    title: "Purpose & Self-Worth",
    description: "Questions about life purpose and self-acceptance",
    questions: questions.slice(28, 35),
    icon: Compass,
    color: "primary-blue",
  },
  {
    title: "Personal Reflection",
    description: "Final questions about your overall well-being",
    questions: questions.slice(35, 42),
    icon: Smile,
    color: "primary-green",
  },
];

const PsychologicalWellbeing: React.FC = () => {
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

  const nextPage = () => {
    if (currentPage < questionPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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
          headerIcon={Brain}
          headerText="Psychological Well-being Assessment"
          headerDescription="Explore your psychological well-being across six key dimensions.
            Rate how much you agree with each statement about yourself."
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
                // question component
                <div
                  key={question.id}
                  className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                >
                  {/* question */}
                  <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                      <span className="text-base sm:text-lg font-bold text-slate-500">
                        Q{question.id}
                      </span>
                      <h4 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                        &quot;{question.text}&quot;
                      </h4>
                    </div>
                  </div>
                  <Slider
                    currentQuestionData={question}
                    value={formData[question.text]}
                    onChange={handleResponse}
                    from="psychologicalWellbeing"
                    min="1"
                    max="7"
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

export default PsychologicalWellbeing;
