import { BookOpenCheck, Heart, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function Carousel() {
  const slides = [
    {
      id: 1,
      image: "/images/career-clarity.jpg",
      icon: <UserCheck className="size-16 text-white" />,
      title: "Career Clarity",
      subtitle: "From career confusion to clarity and direction.",
      description:
        "Discover your strengths and explore possibilities to make informed career choices.",
      gradient: "from-emerald-500/60 via-blue-500/50 to-indigo-600/40",
      accentGradient: "from-emerald-300/20 to-blue-300/20",
    },
    {
      id: 2,
      image: "/images/stress-free-mind.jpg",

      icon: <Heart className="size-16 text-white" />,
      title: "Stress-Free Mind",
      subtitle: "Support in dealing with academic pressure.",
      description:
        "Manage academic pressure and become future ready with clarity and confidence.",
      gradient: "from-teal-500/60 via-cyan-500/50 to-sky-600/40",
      accentGradient: "from-teal-300/20 to-cyan-300/20",
    },
    {
      id: 3,
      image: "/images/confident-action.jpg",
      icon: <BookOpenCheck className="size-16 text-white" />,
      title: "Confident Actions",
      subtitle: "Turn your goals into growth.",
      description:
        "Develop positive habits, set clear goals, and take consistent steps toward the future.",
      gradient: "from-violet-500/60 via-purple-500/50 to-fuchsia-600/40",
      accentGradient: "from-violet-300/20 to-purple-300/20",
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
          className={`absolute inset-0 bg-gradient-to-br ${slides[current].gradient} transition-all duration-1000`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
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

      <div className="relative z-10 h-full flex flex-col justify-end items-center text-center px-16 py-20">
        {/* <div
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
        </div> */}

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
          className={`text-lg text-white/90 max-w-3xl leading-relaxed mb-12 transition-all duration-1000 delay-200 ${
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
