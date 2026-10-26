export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-accent-600" />
      </div>
    </div>
  );
}
