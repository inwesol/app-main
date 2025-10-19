interface ProgressBarProps {
  progressPercentage: number;
}

export default function ProgressBar({ progressPercentage }: ProgressBarProps) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
}
