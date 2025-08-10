import { ArrowLeft } from "lucide-react";

interface PreviousButtonProps {
  onClicking: () => void;
  currentPage: number;
}
function PreviousButton({ onClicking, currentPage }: PreviousButtonProps) {
  return (
    <button
      onClick={onClicking}
      disabled={currentPage === 0}
      className="w-full sm:flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2"
    >
      <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform duration-200" />
      Previous Page
    </button>
  );
}

export default PreviousButton;
