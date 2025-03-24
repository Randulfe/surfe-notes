interface LoadingIndicatorProps {
  label?: string;
}

export const LoadingIndicator = ({
  label = "Loading...",
}: LoadingIndicatorProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <span className="relative flex size-6">
        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
        <span className="bg-primary relative inline-flex size-6 rounded-full"></span>
      </span>
      <p className="text-primary pt-5">{label}</p>
    </div>
  );
};
