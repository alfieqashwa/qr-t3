import { CalendarDays } from "lucide-react";

export const Schedule = () => (
  <section className="flex flex-col items-center">
    <div className="relative h-12 w-12 rounded-full bg-emerald-900 lg:h-14 lg:w-14">
      <CalendarDays
        size={28}
        className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="mt-2 whitespace-nowrap text-xs font-semibold text-slate-300 lg:mt-4">
      26 Juni 2023
    </p>
  </section>
);
