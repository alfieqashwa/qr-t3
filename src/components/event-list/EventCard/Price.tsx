import { DollarSign } from "lucide-react";

export function Price() {
  return (
    <section className="flex flex-col items-center">
      <div className="relative h-12 w-12 rounded-full bg-emerald-900 lg:h-14 lg:w-14">
        <DollarSign
          size={28}
          className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <p className="mt-2 whitespace-nowrap text-xs font-semibold text-slate-300 lg:mt-4">
        IDR <span>500K</span>
      </p>
    </section>
  );
}
