import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface PageNavigationProps {
  index: number;
  currentPage: number;
  setCurrentPage: (papgeindex: number) => void;
}

function PageNavigation({
  index,
  currentPage,
  setCurrentPage,
}: PageNavigationProps) {
  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <Button
      key={index}
      onClick={() => goToPage(index)}
      className={`
                size-10 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex justify-center items-center
                ${
                  index === currentPage
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-lg"
                    : index < currentPage
                    ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
    >
      {index < currentPage ? <CheckCircle className="size-5" /> : index + 1}
    </Button>
  );
}

export default PageNavigation;
