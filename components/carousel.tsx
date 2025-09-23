import { BookOpenCheck, Heart, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function Carousel() {
  const slides = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
      icon: <UserCheck className="size-16 text-white" />,
      title: "Find Your Best Fit",
      subtitle: "Discover careers that align with you",
      description:
        "Get personalized career recommendations based on your interests, strengths, and values. Make informed decisions for a fulfilling future.",
      gradient: "from-primary-green-600 via-primary-blue-600 to-blue-600",
      accentGradient: "from-primary-green-400/30 to-primary-blue-400/30",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/6382633/pexels-photo-6382633.jpeg",

      icon: <Heart className="size-16 text-white" />,
      title: "Wellbeing First",
      subtitle: "Balance career and mental wellness",
      description:
        "Access mental wellness tools, regular check-ins, and stress management support to stay grounded and focused in your career journey.",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      accentGradient: "from-emerald-400/30 to-teal-400/30",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg",
      icon: <BookOpenCheck className="size-16 text-white" />,
      title: "Grow with Purpose",
      subtitle: "Upskill and evolve continuously",
      description:
        "Stay ahead with curated learning paths, skill-building resources, and expert insights to support your career growth and transformation.",
      gradient: "from-slate-600 via-gray-500 to-zinc-400",
      accentGradient: "from-slate-300/30 to-zinc-300/30",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, [current, nextSlide]);

  // const prevSlide = () => {
  //   if (isTransitioning) return;
  //   setIsTransitioning(true);
  //   setTimeout(() => {
  //     setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  //     setIsTransitioning(false);
  //   }, 300);
  // };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative size-full overflow-hidden shadow-xl rounded-3xl">
      <div className="absolute inset-0">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          className={`object-cover transition-all duration-1000 ${
            isTransitioning ? "scale-110 opacity-60" : "scale-105 opacity-90"
          }`}
          priority
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slides[current].gradient} opacity-90 transition-all duration-1000`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-20 right-20 size-32 bg-gradient-to-br ${
            slides[current].accentGradient
          } rounded-full blur-xl animate-pulse transition-all duration-1000 ${
            isTransitioning ? "scale-75 opacity-30" : "scale-100 opacity-60"
          }`}
        />
        <div
          className={`absolute bottom-32 left-16 size-24 bg-gradient-to-br ${
            slides[current].accentGradient
          } rounded-2xl blur-lg animate-pulse transition-all duration-1000 ${
            isTransitioning ? "scale-125 opacity-20" : "scale-100 opacity-40"
          }`}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={`absolute top-1/3 left-1/4 size-16 bg-white/10 rounded-full blur-md animate-bounce transition-all duration-1000`}
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 group"
        disabled={isTransitioning}
      >
        <div className="size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
          <ChevronLeft className="size-7 text-white" />
        </div>
      </button> */}

      {/* <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 group"
        disabled={isTransitioning}
      >
        <div className="size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
          <ChevronRight className="size-7 text-white" />
        </div>
      </button> */}

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-16 py-20">
        <div
          className={`mb-10 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-1000 ${
            isTransitioning
              ? "scale-75 opacity-0 rotate-12"
              : "scale-100 opacity-100 rotate-0"
          }`}
        >
          <div className="relative">
            {slides[current].icon}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        <h2
          className={`text-3xl md:text-5xl font-black text-white mb-6 transition-all duration-1000 ${
            isTransitioning
              ? "translate-y-12 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
          {slides[current].title}
        </h2>

        <p
          className={`text-xl md:text-2xl text-white/95 font-semibold mb-8 transition-all duration-1000 delay-100 ${
            isTransitioning
              ? "translate-y-12 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
        >
          {slides[current].subtitle}
        </p>

        <p
          className={`text-lg text-white/90 max-w-2xl leading-relaxed mb-12 transition-all duration-1000 delay-200 ${
            isTransitioning
              ? "translate-y-12 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
          style={{ textShadow: "0 1px 5px rgba(0,0,0,0.2)" }}
        >
          {slides[current].description}
        </p>

        <div className="flex space-x-4 mb-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full border-2 ${
                index === current
                  ? "w-16 h-4 bg-white border-white shadow-lg"
                  : "size-4 bg-white/30 border-white/50 hover:bg-white/50 hover:border-white/70 hover:scale-125"
              }`}
              disabled={isTransitioning}
            />
          ))}
        </div>

        {/* <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white to-white/80 transition-all duration-7000 ease-linear rounded-full shadow-lg"
            style={{
              width: `${((current + 1) / slides.length) * 100}%`,
            }}
          />
        </div> */}
      </div>

      <div className="absolute top-8 left-8 size-20 border-l-4 border-t-4 border-white/30 rounded-tl-2xl" />
      <div className="absolute bottom-8 right-8 size-20 border-r-4 border-b-4 border-white/30 rounded-br-2xl" />
    </div>
  );
}
