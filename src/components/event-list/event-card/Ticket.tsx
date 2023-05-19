import { Ticket as TicketIcon } from "lucide-react";

type TicketProps = {
  price: number;
  qty: number;
};

export const Ticket = ({ qty }: { qty: number }) => (
  <section className="flex flex-col items-center">
    <div
      className={`relative h-12 w-12 rounded-full lg:h-14 lg:w-14 ${
        !!qty ? "bg-emerald-900" : "bg-accent"
      }`}
    >
      <TicketIcon
        size={28}
        className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="mt-2 whitespace-nowrap text-xs font-semibold text-slate-300 lg:mt-4">
      <span>127</span> pcs left
    </p>
  </section>
);
