interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading PawID details...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[250px]">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-forest-100 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-forest-900 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-forest-900">{message}</p>
    </div>
  );
}
