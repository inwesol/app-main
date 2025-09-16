import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Lightbulb,
  Info,
} from "lucide-react";
import { InputField } from "@/components/activity-components/input-field";
import { TextArea } from "@/components/activity-components/text-area";

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
        className="cursor-pointer bg-gradient-to-r from-amber-50/80 to-orange-50/80 hover:from-amber-50/100 hover:to-to-orange-50/80  transition-all duration-400 rounded-t-lg border-b border-amber-200/60"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Book className="size-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text  transition-all duration-300">
                {displayTitle}
              </CardTitle>
              {
                <p className="text-sm text-amber-600/80 mt-2 line-clamp-1 transition-all duration-300 font-medium">
                  {getSummaryPreview()}
                </p>
              }
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/50 rounded-full px-4 py-2 border border-amber-200/60 transition-all duration-300 hover:bg-white/70 hover:border-amber-300/80">
            <span className="text-sm text-amber-700 font-semibold transition-colors duration-300">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            <div className="transition-transform duration-400 ease-in-out">
              {isExpanded ? (
                <ChevronUp className="size-5 text-amber-700 transition-all duration-300 hover:text-amber-800" />
              ) : (
                <ChevronDown className="size-5 text-amber-700 transition-all duration-300 hover:text-amber-800" />
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
        <CardContent className="space-y-8 pt-6 pb-8 bg-gradient-to-b from-white/40 to-emerald-50/30">
          {/* Transition Essay */}
          {data.transitionEssay && (
            <div className="bg-gradient-to-br from-emerald-100/80 via-primary-green-100/80 to-teal-100/80 rounded-2xl p-6 border-2 border-emerald-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-emerald-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-primary-green-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <PenTool className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-emerald-800 text-lg bg-gradient-to-r from-emerald-700 to-primary-green-700 bg-clip-text ">
                  Current Transition
                </h4>
              </div>
              <p className="text-sm text-emerald-900/90 leading-relaxed font-medium transition-colors duration-300">
                {data.transitionEssay}
              </p>
            </div>
          )}

          {/* Occupations */}
          {data.occupations && (
            <div className="bg-gradient-to-br from-cyan-100/80 via-blue-100/80 to-teal-100/80 rounded-2xl p-6 border-2 border-cyan-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-cyan-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <Users className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-cyan-800 text-lg bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text ">
                  Career Aspirations
                </h4>
              </div>
              <p className="text-sm text-cyan-900/90 leading-relaxed font-medium transition-colors duration-300">
                {data.occupations}
              </p>
            </div>
          )}

          {/* Heroes */}
          {data.heroes.length > 0 && (
            <div className="bg-gradient-to-br from-amber-100/80 via-yellow-100/80 to-orange-100/80 rounded-2xl p-6 border-2 border-amber-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-amber-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <Star className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-amber-800 text-lg bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text ">
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
                      <div className="shrink-0 size-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-amber-900 mb-2 text-base transition-colors duration-300">
                          {hero.title}
                        </h5>
                        <p className="text-sm text-amber-800/90 leading-relaxed font-medium transition-colors duration-300">
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
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <Tv className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-purple-800 text-lg bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text ">
                  {storyNumber === 2
                    ? "Media Analysis & RIASEC"
                    : "Media & Entertainment"}
                </h4>
              </div>
              <div className="space-y-4">
                {data.magazines && (
                  <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                    <h5 className="font-bold text-purple-900 mb-2 transition-colors duration-300">
                      {storyNumber === 2
                        ? "Media Preferences & RIASEC Codes:"
                        : storyNumber === 3
                        ? "Selected RIASEC & Analysis:"
                        : "What they watch/read:"}
                    </h5>
                    <p className="text-sm text-purple-800/90 font-medium transition-colors duration-300">
                      {data.magazines}
                    </p>
                  </div>
                )}
                {data.magazineWhy && (
                  <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                    <h5 className="font-bold text-purple-900 mb-2 transition-colors duration-300">
                      {storyNumber === 2
                        ? "Media Activities & Setting Preferences:"
                        : storyNumber === 3
                        ? "Story Plot Analysis:"
                        : "Why they enjoy it:"}
                    </h5>
                    <p className="text-sm text-purple-800/90 font-medium transition-colors duration-300">
                      {data.magazineWhy}
                    </p>
                  </div>
                )}
                {data.mediaActivities && (
                  <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                    <h5 className="font-bold text-purple-900 mb-2 transition-colors duration-300">
                      Media Activities Analysis:
                    </h5>
                    <p className="text-sm text-purple-800/90 font-medium transition-colors duration-300">
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
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <BookOpen className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-teal-800 text-lg bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text ">
                  {storyNumber === 2
                    ? "SELF Statement"
                    : storyNumber === 3
                    ? "SCRIPT Analysis"
                    : "Favorite Story"}
                </h4>
              </div>
              <div className="bg-white/70 rounded-lg p-4 border border-teal-200/60">
                <p className="text-sm text-teal-900/90 leading-relaxed font-medium transition-colors duration-300">
                  {data.favoriteStory}
                </p>
              </div>
              {data.plotDescription && (
                <div className="bg-white/70 rounded-lg p-4 border border-teal-200/60 mt-4">
                  <h5 className="font-bold text-teal-900 mb-2 transition-colors duration-300">
                    Plot Description:
                  </h5>
                  <p className="text-sm text-teal-800/90 font-medium transition-colors duration-300">
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
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <Heart className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-rose-800 text-lg bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text ">
                  {storyNumber === 2
                    ? "SETTING Statement"
                    : storyNumber === 3
                    ? "Personal Career Motto"
                    : "Words to Live By"}
                </h4>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-rose-200/60 shadow-inner">
                <p className="text-sm text-rose-900/90 leading-relaxed italic font-semibold transition-colors duration-300 text-center">
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
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <Target className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-yellow-800 text-lg bg-gradient-to-r from-yellow-700 to-amber-700 bg-clip-text ">
                  Excellence Formula
                </h4>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-yellow-200/60 shadow-inner">
                <p className="text-sm text-yellow-900/90 leading-relaxed font-semibold transition-colors duration-300">
                  {data.excellenceFormula}
                </p>
              </div>
            </div>
          )}

          {/* Selected Occupations - Only for Career Story 3 */}
          {data.selectedOccupations && data.selectedOccupations.length > 0 && (
            <div className="bg-gradient-to-br from-primary-green-100/80 via-emerald-100/80 to-teal-100/80 rounded-2xl p-6 border-2 border-primary-green-200/70 shadow-lg transition-all duration-400 hover:shadow-xl hover:border-primary-green-300/80 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary-green-500 to-emerald-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <Users className="size-5 text-white" />
                </div>
                <h4 className="font-bold text-primary-green-800 text-lg bg-gradient-to-r from-primary-green-700 to-emerald-700 bg-clip-text ">
                  Final Occupation Choices
                </h4>
              </div>
              <div className="bg-white/70 rounded-lg p-4 border border-primary-green-200/60">
                <p className="text-sm font-medium text-primary-green-800 mb-3">
                  Selected Occupations ({data.selectedOccupations.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.selectedOccupations.map((occupation, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-primary-green-500 to-emerald-500 text-white text-sm rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      {occupation}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Completion Status */}
          {/* <div className="pt-6 border-t-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-lg p-4 transition-all duration-300">
            <div className="flex items-center gap-3 text-sm text-emerald-700 font-semibold transition-colors duration-300">
              <div className="p-1 bg-emerald-100 rounded-md">
                <FileText className="size-4 text-emerald-600 transition-colors duration-300" />
              </div>
              <span>Completed on: {new Date().toLocaleDateString()}</span>
            </div>
          </div> */}
        </CardContent>
      </div>
    </Card>
  );
}
<Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
  <CardHeader>
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-primary-green-100 rounded-lg">
            <Lightbulb className="sm:size-5 text-primary-green-600 size-4" />
          </div>
          <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
            Hero Analysis
          </CardTitle>
        </div>
        <div>
          <Sheet>
            <SheetTrigger>
              <Info className="text-slate-700 size-4 sm:size-5" />
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[800px] overflow-y-scroll bg-gradient-to-r from-primary-green-100 to-white">
              <SheetHeader>
                <SheetTitle className="text-primary-green-600 text-xl font-bold">
                  Career Story Exploration - 1
                </SheetTitle>
                <SheetDescription>
                  {/* Childhood Heroes & Role Models */}
                </SheetDescription>
              </SheetHeader>
              {mockCareerStoryData.heroes.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="font-medium text-slate-600 text-sm">
                      Childhood Heroes & Role Models
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {mockCareerStoryData.heroes.map((hero, index) => (
                      <div
                        key={hero.id}
                        className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md transition-all duration-300 hover:bg-white hover:border-primary-green-300/80 hover:shadow-lg hover:scale-[1.01]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 size-6 bg-primary-green-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg">
                            <span className="text-xs font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h5 className="text-primary-green-600 font-semibold">
                              {hero.title}
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed ">
                              {hero.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          Analyze the descriptive words you used for your role models to
          understand your core values and aspirations.
        </p>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      <div>
        <label
          htmlFor="firstAdjectives"
          className="block text-sm font-medium text-slate-600 mb-2"
        >
          Write down the first adjective you used to describe each one of them:
        </label>
        <InputField
          id="firstAdjectives"
          value={formData.firstAdjectives}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              firstAdjectives: value,
            }))
          }
          placeholder="e.g., brave, intelligent, compassionate..."
        />
      </div>

      <div>
        <label
          htmlFor="repeatedWords"
          className="block text-sm font-medium text-slate-600 mb-2"
        >
          Write down any words or similar words that you used more than once to
          describe them:
        </label>
        <InputField
          id="repeatedWords"
          value={formData.repeatedWords}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, repeatedWords: value }))
          }
          placeholder="e.g., determined, caring, innovative..."
        />
      </div>

      <div>
        <label
          htmlFor="commonTraits"
          className="block text-sm font-medium text-slate-600 mb-2"
        >
          Write down two or more things your heroes or heroines have in common:
        </label>
        <TextArea
          id="commonTraits"
          value={formData.commonTraits}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, commonTraits: value }))
          }
          placeholder="Describe the common characteristics, values, or behaviors you notice across your role models..."
          rows={3}
        />
      </div>

      <div>
        <label
          htmlFor="significantWords"
          className="block text-sm font-medium text-slate-600 mb-2"
        >
          List any other significant words or phrases you used to describe them:
        </label>
        <TextArea
          id="significantWords"
          value={formData.significantWords}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              significantWords: value,
            }))
          }
          placeholder="Include any other meaningful descriptors that stood out to you..."
          rows={3}
        />
      </div>
    </div>
  </CardContent>
</Card>;
