"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  User,
  Target,
  TrendingUp,
  Wrench,
  Microscope,
  Palette,
  Heart,
  Briefcase,
  FileText,
  BarChart3,
  Award,
  Info,
  Clock,
  CheckSquare,
} from "lucide-react";
import Header from "@/components/form-components/header";

interface Question {
  id: number;
  text: string;
  category:
    | "realistic"
    | "investigative"
    | "artistic"
    | "social"
    | "enterprising"
    | "conventional";
}

const questions: Question[] = [
  { id: 1, text: "I like to work on cars", category: "realistic" },
  { id: 2, text: "I like to do puzzles", category: "investigative" },
  {
    id: 3,
    text: "I am good at working independently",
    category: "investigative",
  },
  { id: 4, text: "I like to work in teams", category: "social" },
  {
    id: 5,
    text: "I am an ambitious person, I set goals for myself",
    category: "enterprising",
  },
  {
    id: 6,
    text: "I like to organize things (files, desks/offices)",
    category: "conventional",
  },
  { id: 7, text: "I like to build things", category: "realistic" },
  { id: 8, text: "I like to read about art and music", category: "artistic" },
  {
    id: 9,
    text: "I like to have clear instructions to follow",
    category: "conventional",
  },
  {
    id: 10,
    text: "I like to try to influence or persuade people",
    category: "enterprising",
  },
  { id: 11, text: "I like to do experiments", category: "investigative" },
  { id: 12, text: "I like to teach or train people", category: "social" },
  {
    id: 13,
    text: "I like trying to help people solve their problems",
    category: "social",
  },
  { id: 14, text: "I like to take care of animals", category: "realistic" },
  {
    id: 15,
    text: "I wouldn't mind working 8 hours per day in an office",
    category: "conventional",
  },
  { id: 16, text: "I like selling things", category: "enterprising" },
  { id: 17, text: "I enjoy creative writing", category: "artistic" },
  { id: 18, text: "I enjoy science", category: "investigative" },
  {
    id: 19,
    text: "I am quick to take on new responsibilities",
    category: "enterprising",
  },
  { id: 20, text: "I am interested in healing people", category: "social" },
  {
    id: 21,
    text: "I enjoy trying to figure out how things work",
    category: "investigative",
  },
  {
    id: 22,
    text: "I like putting things together or assembling things",
    category: "realistic",
  },
  { id: 23, text: "I am a creative person", category: "artistic" },
  { id: 24, text: "I pay attention to details", category: "conventional" },
  { id: 25, text: "I like to do filing or typing", category: "conventional" },
  {
    id: 26,
    text: "I like to analyze things (problems/situations)",
    category: "investigative",
  },
  { id: 27, text: "I like to play instruments or sing", category: "artistic" },
  { id: 28, text: "I enjoy learning about other cultures", category: "social" },
  {
    id: 29,
    text: "I would like to start my own business",
    category: "enterprising",
  },
  { id: 30, text: "I like to cook", category: "realistic" },
  { id: 31, text: "I like acting in plays", category: "artistic" },
  { id: 32, text: "I am a practical person", category: "realistic" },
  {
    id: 33,
    text: "I like working with numbers or charts",
    category: "conventional",
  },
  {
    id: 34,
    text: "I like to get into discussions about issues",
    category: "social",
  },
  {
    id: 35,
    text: "I am good at keeping records of my work",
    category: "conventional",
  },
  { id: 36, text: "I like to lead", category: "enterprising" },
  { id: 37, text: "I like working outdoors", category: "realistic" },
  {
    id: 38,
    text: "I would like to work in an office",
    category: "conventional",
  },
  { id: 39, text: "I'm good at math", category: "investigative" },
  { id: 40, text: "I like helping people", category: "social" },
  { id: 41, text: "I like to draw", category: "artistic" },
  { id: 42, text: "I like to give speeches", category: "enterprising" },
];

export default function RiasecTest() {
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [showResults, setShowResults] = useState(false);

  const handleToggleQuestion = (questionId: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleClearAll = () => {
    setSelectedQuestions(new Set());
    setShowResults(false);
  };

  const calculateResults = () => {
    const categoryScores = {
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0,
    };

    selectedQuestions.forEach((questionId) => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        categoryScores[question.category]++;
      }
    });

    return categoryScores;
  };

  const results = calculateResults();
  const totalSelected = selectedQuestions.size;
  const progressPercentage = (totalSelected / questions.length) * 100;

  const categoryInfo = {
    realistic: {
      name: "Realistic",
      description: "Hands-on, practical work with tools, machines, or nature",
      //   color: "primary-green",
      icon: Wrench,
    },
    investigative: {
      name: "Investigative",
      description: "Scientific, analytical, and research-oriented work",
      //   color: "primary-blue",
      icon: Microscope,
    },
    artistic: {
      name: "Artistic",
      description: "Creative, expressive, and aesthetic work",
      //   color: "purple",
      icon: Palette,
    },
    social: {
      name: "Social",
      description: "Helping, teaching, and working with people",
      //   color: "primary-green",
      icon: Heart,
    },
    enterprising: {
      name: "Enterprising",
      description: "Leadership, persuasion, and business-oriented work",
      //   color: "orange",
      icon: Briefcase,
    },
    conventional: {
      name: "Conventional",
      description: "Organized, detail-oriented, and systematic work",
      //   color: "primary-blue",
      icon: FileText,
    },
  };

  const getCategoryColorClasses = (category: string, isSelected: boolean) => {
    const info = categoryInfo[category as keyof typeof categoryInfo];
    if (isSelected) {
      switch (info.color) {
        case "primary-blue":
          return "bg-gradient-to-br from-primary-blue-50 to-primary-blue-100 border-primary-blue-200";
        case "primary-green":
          return "bg-gradient-to-br from-primary-green-50 to-primary-green-100 border-primary-green-200";
        case "purple":
          return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200";
        case "orange":
          return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200";
        default:
          return "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200";
      }
    }
    return "bg-white/95 border-slate-200 hover:bg-slate-50";
  };

  //   const getIconColorClasses = (category: string, isSelected: boolean) => {
  //     const info = categoryInfo[category as keyof typeof categoryInfo];
  //     if (isSelected) {
  //       switch (info.color) {
  //         case "primary-blue":
  //           return "bg-gradient-to-br from-blue-500 to-primary-blue-600 text-white";
  //         case "primary-green":
  //           return "bg-gradient-to-br from-primary-green-500 to-primary-green-600 text-white";
  //         case "purple":
  //           return "bg-gradient-to-br from-purple-500 to-purple-600 text-white";
  //         case "orange":
  //           return "bg-gradient-to-br from-orange-500 to-orange-600 text-white";
  //         default:
  //           return "bg-gradient-to-br from-slate-500 to-slate-600 text-white";
  //       }
  //     }
  //     return "bg-slate-100 text-slate-600 group-hover:bg-slate-200";
  //   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Header */}
        <Header
          headerIcon={BarChart3}
          headerText="RIASEC Career Interest Assessment"
          headerDescription="Discover your career personality and explore potential career paths
            that align with your interests and strengths."
        />

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Info className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                What is RIASEC?
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              RIASEC is a career assessment model that categorizes interests
              into six personality types:
              <span className="font-semibold">
                {" "}
                Realistic, Investigative, Artistic, Social, Enterprising, and
                Conventional
              </span>
              .
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4  sm:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                How to Take It
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Read each statement carefully and{" "}
              <span className="font-semibold">
                select the ones that describe you
              </span>
              . There are no right or wrong answers - choose based on your
              genuine interests and preferences.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Time & Results
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Takes about <span className="font-semibold">5-10 minutes</span> to
              complete. Your results will show your strongest interest areas and
              suggest compatible career paths.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-slate-200 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Instructions</h3>
            </div>
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 gap-4 text-slate-700">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Read each statement</span>{" "}
                      carefully and think about whether it describes your
                      interests or preferences.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Click to select</span>{" "}
                      statements that resonate with you. You can select as many
                      or as few as you like.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Be honest</span> - choose
                      based on what you genuinely enjoy, not what you think you
                      should like.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      4
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">View your results</span>{" "}
                      to see your interest profile and explore career
                      suggestions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              {totalSelected} of {questions.length} statements selected
            </span>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-primary-green-400 hover:to-primary-blue-500 rounded-lg transition-all duration-300 border border-slate-300 hover:border-transparent hover:shadow-lg hover:scale-105"
              aria-label="Clear all selections"
            >
              <RotateCcw className="size-4 mr-2" />
              Reset All
            </button>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-slate-500 text-center">
            {Math.round(progressPercentage)}% Complete
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid gap-4 mb-6 sm:mb-8 lg:grid-cols-2">
          {questions.map((question) => {
            const isSelected = selectedQuestions.has(question.id);
            const CategoryIcon = categoryInfo[question.category].icon;

            return (
              <div
                key={question.id}
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl border-2`}
                onClick={() => handleToggleQuestion(question.id)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleQuestion(question.id);
                  }
                }}
              >
                <div className="relative p-4 sm:p-6 flex items-center space-x-4">
                  {/* Category Icon */}
                  <div
                    className={`shrink-0 size-12 sm:size-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isSelected
                        ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white"
                        : "bg-slate-100 group-hover:bg-slate-200 text-slate-600"
                    }
                    }`}
                  >
                    <CategoryIcon className="size-5 sm:size-6" />
                  </div>

                  {/* Question Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm sm:text-base font-semibold transition-colors duration-300 leading-relaxed ${
                        isSelected
                          ? "text-slate-800"
                          : "text-slate-700 group-hover:text-slate-900"
                      }`}
                    >
                      {question.text}
                    </p>
                    {/* label either R,I,A,S,E,C */}
                    {/* <p
                      className={`text-xs sm:text-sm mt-1 capitalize font-medium transition-colors duration-300 ${
                        isSelected ? "text-slate-600" : "text-slate-500"
                      }`}
                    >
                      {categoryInfo[question.category].name}
                    </p> */}
                  </div>

                  {/* Selection Indicator */}
                  <div className="shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="size-4 sm:size-5 text-primary-green-400 bg-primary-green-50 rounded-full" />
                    ) : (
                      <Circle className="size-4 sm:size-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Results Section */}
        {/* {totalSelected > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
            <div className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-t-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 sm:size-14 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="size-6 sm:size-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                      Your Interest Profile
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      Based on your {totalSelected} selections
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white rounded-xl hover:from-primary-blue-600 hover:to-primary-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                >
                  {showResults ? "Hide Details" : "Show Details"}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid gap-4 sm:gap-6">
                {Object.entries(results).map(([category, score]) => {
                  const info =
                    categoryInfo[category as keyof typeof categoryInfo];
                  const IconComponent = info.icon;
                  const percentage =
                    totalSelected > 0 ? (score / totalSelected) * 100 : 0;

                  return (
                    <div key={category} className="group">
                      <div className="flex items-center mb-3">
                        <div
                          className={`size-10 sm:size-12 rounded-xl flex items-center justify-center mr-4 shadow-lg ${getIconColorClasses(
                            category,
                            score > 0
                          )}`}
                        >
                          <IconComponent className="size-4 sm:size-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                              {info.name}
                            </h3>
                            <span className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
                              {score}/{totalSelected} ({Math.round(percentage)}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="w-full bg-slate-200 rounded-full h-3 sm:h-4 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {showResults && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center">
                    <TrendingUp className="size-5 sm:size-6 mr-3 text-primary-blue-500" />
                    Detailed Category Analysis
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Object.entries(categoryInfo).map(([key, info]) => {
                      const IconComponent = info.icon;
                      const score = results[key as keyof typeof results];

                      return (
                        <div
                          key={key}
                          className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center mb-4">
                            <div
                              className={`size-10 sm:size-12 rounded-xl flex items-center justify-center shadow-lg ${getIconColorClasses(
                                key,
                                score > 0
                              )}`}
                            >
                              <IconComponent className="size-5 sm:size-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                                {info.name}
                              </h4>
                              <div className="text-xs sm:text-sm font-semibold text-slate-600">
                                {score} selections
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                            {info.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Action Button */}
        <div className="flex justify-center pt-6 border-t border-slate-200 mt-6">
          <button className="px-6 py-3 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2">
            <Award className="size-5" />
            Complete Assessment
          </button>
        </div>
        {/* Footer */}
        <div className="text-center text-slate-600 bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mt-6 sm:mt-8">
          <p className="text-sm sm:text-base leading-relaxed">
            The RIASEC model was developed by psychologist John Holland to help
            people understand their career interests and find suitable work
            environments that match their personality.
          </p>
        </div>
      </div>
    </div>
  );
}
