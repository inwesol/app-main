import { ArrowRight } from "lucide-react";

interface NextButtonProps {
  onClicking: () => void;
}
function NextButton({ onClicking }: NextButtonProps) {
  return (
    <button
      type="button"
      onClick={onClicking}
      className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
    >
      Next Page
      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
    </button>
  );
}

export default NextButton;
