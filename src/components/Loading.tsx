import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="grid h-[calc(100vh_-_30vh)] w-full place-items-center">
    <Loader2
      size={50}
      color="rgb(148 163 184)"
      className="animate-spin text-slate-800"
    />
  </div>
);
