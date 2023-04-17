import { Ticket as TicketIcon } from "lucide-react";

export const Ticket = () => (
  <>
    <div className="relative h-14 w-14 rounded-full bg-emerald-900">
      <TicketIcon
        size={28}
        className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-300">
      <span>127</span> pcs left
    </p>
  </>
);
