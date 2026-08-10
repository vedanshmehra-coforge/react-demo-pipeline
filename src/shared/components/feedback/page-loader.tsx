import { Spinner } from '@shared/components/ui/spinner';

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" />
  </div>
);

export const FullPageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
  </div>
);
