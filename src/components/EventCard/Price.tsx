import { DollarSign } from "lucide-react";

export function Price() {
  return (
    <section>
      <div className="relative h-14 w-14 rounded-full bg-emerald-900">
        <DollarSign
          size={28}
          className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-300">
        IDR <span>500K</span>
      </p>
    </section>
  );
}
