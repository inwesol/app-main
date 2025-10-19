import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Book,
  PenTool,
  Users,
  Star,
  Tv,
  BookOpen,
  Heart,
  Target,
} from "lucide-react";

interface HeroItem {
  id: string;
  title: string;
  description: string;
}

interface CareerStoryData {
  transitionEssay: string;
  occupations: string;
  heroes: HeroItem[];
  magazines: string;
  magazineWhy: string;
  favoriteStory: string;
  favoriteSaying: string;
  // Additional fields for Career Story 2
  riasecCodes?: string;
  mediaActivities?: string;
  // Additional fields for Career Story 3
  plotDescription?: string;
  excellenceFormula?: string;
  selectedOccupations?: string[];
}

interface CareerStorySummaryProps {
  storyNumber: number;
  title?: string;
  data: CareerStoryData;
  className?: string;
}

export function CareerStorySummary({
  storyNumber,
  title,
  data,
  className = "",
}: CareerStorySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const defaultTitle = `Career Story ${storyNumber}`;
  const displayTitle = title || defaultTitle;

  const getSummaryPreview = () => {
    const parts = [];
    if (data.transitionEssay)
      parts.push(`Transition: ${data.transitionEssay.substring(0, 50)}...`);
    if (data.occupations)
      parts.push(`Occupations: ${data.occupations.substring(0, 40)}...`);
    if (data.heroes.length > 0)
      parts.push(`Heroes: ${data.heroes.length} role models`);
    return parts.join(" | ");
  };

  return (
    <Card
      className={`mb-8 bg-gradient-to-r from-amber-50/80 to-orange-50/80border-2 border-amber-200/60shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:border-amber-200/30 backdrop-blur-sm overflow-hidden ${className}`}
    >
      <CardHeader
        className="transition-all border-b rounded-t-lg cursor-pointer bg-gradient-to-r from-amber-50/80 to-orange-50/80 hover:from-amber-50/100 hover:to-to-orange-50/80 duration-400 border-amber-200/60"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 transition-all duration-300 shadow-lg bg-amber-500 rounded-xl hover:shadow-xl hover:scale-110">
              <Book className="text-white size-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-orange-800 transition-all duration-300 sm:text-2xl bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text">
                {displayTitle}
              </CardTitle>
              {
                <p className="mt-2 text-sm font-medium transition-all duration-300 text-amber-600/80 line-clamp-1">
                  {getSummaryPreview()}
                </p>
              }
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 transition-all duration-300 border rounded-full bg-white/50 border-amber-200/60 hover:bg-white/70 hover:border-amber-300/80">
            <span className="text-sm font-semibold transition-colors duration-300 text-amber-700">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            <div className="transition-transform ease-in-out duration-400">
              {isExpanded ? (
                <ChevronUp className="transition-all duration-300 size-5 text-amber-700 hover:text-amber-800" />
              ) : (
                <ChevronDown className="transition-all duration-300 size-5 text-amber-700 hover:text-amber-800" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <div
        className={`overflow-hidden transition-all duration-600 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CardContent className="pt-6 pb-8 space-y-8 bg-gradient-to-b from-white/40 to-emerald-50/30">
          {/* Transition Essay */}
          {data.transitionEssay && (
            <div className="bg-gradient-to-br from-emerald-100/80 via-primary-green-100/80 to-teal-100/80 rounded-2xl p-6 border-2 border-emerald-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-emerald-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-emerald-500 to-primary-green-600 hover:shadow-lg">
                  <PenTool className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-emerald-800 bg-gradient-to-r from-emerald-700 to-primary-green-700 bg-clip-text ">
                  Current Transition
                </h4>
              </div>
              <p className="text-sm font-medium leading-relaxed transition-colors duration-300 text-emerald-900/90">
                {data.transitionEssay}
              </p>
            </div>
          )}

          {/* Occupations */}
          {data.occupations && (
            <div className="bg-gradient-to-br from-cyan-100/80 via-blue-100/80 to-teal-100/80 rounded-2xl p-6 border-2 border-cyan-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-cyan-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-cyan-500 to-blue-600 hover:shadow-lg">
                  <Users className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-cyan-800 bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text ">
                  Career Aspirations
                </h4>
              </div>
              <p className="text-sm font-medium leading-relaxed transition-colors duration-300 text-cyan-900/90">
                {data.occupations}
              </p>
            </div>
          )}

          {/* Heroes */}
          {data.heroes.length > 0 && (
            <div className="bg-gradient-to-br from-amber-100/80 via-yellow-100/80 to-orange-100/80 rounded-2xl p-6 border-2 border-amber-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-amber-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-amber-500 to-orange-600 hover:shadow-lg">
                  <Star className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-amber-800 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text ">
                  Childhood Heroes & Role Models
                </h4>
              </div>
              <div className="space-y-4">
                {data.heroes.map((hero, index) => (
                  <div
                    key={hero.id}
                    className="bg-white/90 rounded-xl p-4 border border-amber-200/60 shadow-md transition-all duration-300 hover:bg-white hover:border-amber-300/80 hover:shadow-lg hover:scale-[1.01]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center transition-all duration-300 rounded-full shadow-md shrink-0 size-8 bg-gradient-to-br from-amber-400 to-orange-500 hover:shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="mb-2 text-base font-bold transition-colors duration-300 text-amber-900">
                          {hero.title}
                        </h5>
                        <p className="text-sm font-medium leading-relaxed transition-colors duration-300 text-amber-800/90">
                          {hero.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media & Entertainment */}
          {(data.magazines || data.magazineWhy) && (
            <div className="bg-gradient-to-br from-purple-100/80 via-violet-100/80 to-indigo-100/80 rounded-2xl p-6 border-2 border-purple-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-purple-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-purple-500 to-indigo-600 hover:shadow-lg">
                  <Tv className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-purple-800 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text ">
                  {storyNumber === 2
                    ? "Media Analysis & RIASEC"
                    : "Media & Entertainment"}
                </h4>
              </div>
              <div className="space-y-4">
                {data.magazines && (
                  <div className="p-3 border rounded-lg bg-white/60 border-purple-200/50">
                    <h5 className="mb-2 font-bold text-purple-900 transition-colors duration-300">
                      {storyNumber === 2
                        ? "Media Preferences & RIASEC Codes:"
                        : storyNumber === 3
                        ? "Selected RIASEC & Analysis:"
                        : "What they watch/read:"}
                    </h5>
                    <p className="text-sm font-medium transition-colors duration-300 text-purple-800/90">
                      {data.magazines}
                    </p>
                  </div>
                )}
                {data.magazineWhy && (
                  <div className="p-3 border rounded-lg bg-white/60 border-purple-200/50">
                    <h5 className="mb-2 font-bold text-purple-900 transition-colors duration-300">
                      {storyNumber === 2
                        ? "Media Activities & Setting Preferences:"
                        : storyNumber === 3
                        ? "Story Plot Analysis:"
                        : "Why they enjoy it:"}
                    </h5>
                    <p className="text-sm font-medium transition-colors duration-300 text-purple-800/90">
                      {data.magazineWhy}
                    </p>
                  </div>
                )}
                {data.mediaActivities && (
                  <div className="p-3 border rounded-lg bg-white/60 border-purple-200/50">
                    <h5 className="mb-2 font-bold text-purple-900 transition-colors duration-300">
                      Media Activities Analysis:
                    </h5>
                    <p className="text-sm font-medium transition-colors duration-300 text-purple-800/90">
                      {data.mediaActivities}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Favorite Story */}
          {data.favoriteStory && (
            <div className="bg-gradient-to-br from-teal-100/80 via-cyan-100/80 to-blue-100/80 rounded-2xl p-6 border-2 border-teal-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-teal-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-teal-500 to-cyan-600 hover:shadow-lg">
                  <BookOpen className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-teal-800 bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text ">
                  {storyNumber === 2
                    ? "SELF Statement"
                    : storyNumber === 3
                    ? "SCRIPT Analysis"
                    : "Favorite Story"}
                </h4>
              </div>
              <div className="p-4 border rounded-lg bg-white/70 border-teal-200/60">
                <p className="text-sm font-medium leading-relaxed transition-colors duration-300 text-teal-900/90">
                  {data.favoriteStory}
                </p>
              </div>
              {data.plotDescription && (
                <div className="p-4 mt-4 border rounded-lg bg-white/70 border-teal-200/60">
                  <h5 className="mb-2 font-bold text-teal-900 transition-colors duration-300">
                    Plot Description:
                  </h5>
                  <p className="text-sm font-medium transition-colors duration-300 text-teal-800/90">
                    {data.plotDescription}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Favorite Saying */}
          {data.favoriteSaying && (
            <div className="bg-gradient-to-br from-rose-100/80 via-pink-100/80 to-red-100/80 rounded-2xl p-6 border-2 border-rose-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-rose-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-rose-500 to-pink-600 hover:shadow-lg">
                  <Heart className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-rose-800 bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text ">
                  {storyNumber === 2
                    ? "SETTING Statement"
                    : storyNumber === 3
                    ? "Personal Career Motto"
                    : "Words to Live By"}
                </h4>
              </div>
              <div className="p-4 border shadow-inner bg-white/80 rounded-xl border-rose-200/60">
                <p className="text-sm italic font-semibold leading-relaxed text-center transition-colors duration-300 text-rose-900/90">
                  {storyNumber === 3
                    ? `"${data.favoriteSaying}"`
                    : data.favoriteSaying}
                </p>
              </div>
            </div>
          )}

          {/* Excellence Formula - Only for Career Story 3 */}
          {data.excellenceFormula && (
            <div className="bg-gradient-to-br from-yellow-100/80 via-amber-100/80 to-orange-100/80 rounded-2xl p-6 border-2 border-yellow-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-yellow-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-yellow-500 to-amber-600 hover:shadow-lg">
                  <Target className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-yellow-800 bg-gradient-to-r from-yellow-700 to-amber-700 bg-clip-text ">
                  Excellence Formula
                </h4>
              </div>
              <div className="p-4 border shadow-inner bg-white/80 rounded-xl border-yellow-200/60">
                <p className="text-sm font-semibold leading-relaxed transition-colors duration-300 text-yellow-900/90">
                  {data.excellenceFormula}
                </p>
              </div>
            </div>
          )}

          {/* Selected Occupations - Only for Career Story 3 */}
          {data.selectedOccupations && data.selectedOccupations.length > 0 && (
            <div className="bg-gradient-to-br from-primary-green-100/80 via-emerald-100/80 to-teal-100/80 rounded-2xl p-6 border-2 border-primary-green-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-primary-green-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-primary-green-500 to-emerald-600 hover:shadow-lg">
                  <Users className="text-white size-5" />
                </div>
                <h4 className="text-lg font-bold text-primary-green-800 bg-gradient-to-r from-primary-green-700 to-emerald-700 bg-clip-text ">
                  Final Occupation Choices
                </h4>
              </div>
              <div className="p-4 border rounded-lg bg-white/70 border-primary-green-200/60">
                <p className="mb-3 text-sm font-medium text-primary-green-800">
                  Selected Occupations ({data.selectedOccupations.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.selectedOccupations.map((occupation) => (
                    <span
                      key={occupation}
                      className="px-3 py-1 text-sm text-white transition-all duration-300 rounded-full shadow-md bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:shadow-lg hover:scale-105"
                    >
                      {occupation}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Completion Status */}
          {/* <div className="p-4 pt-6 transition-all duration-300 border-t-2 rounded-lg border-emerald-200/60 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
            <div className="flex items-center gap-3 text-sm font-semibold transition-colors duration-300 text-emerald-700">
              <div className="p-1 rounded-md bg-emerald-100">
                <FileText className="transition-colors duration-300 size-4 text-emerald-600" />
              </div>
              <span>Completed on: {new Date().toLocaleDateString()}</span>
            </div>
          </div> */}
        </CardContent>
      </div>
    </Card>
  );
}
