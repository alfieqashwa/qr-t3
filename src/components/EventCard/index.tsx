import { CalendarDaysIcon, DollarSignIcon, TicketIcon } from "lucide-react";
import Image from "next/image";

export const EventCard = () => {
  return (
    <section className="flex w-full space-x-6 rounded-xl bg-slate-800 p-6 shadow-lg">
      <div className="relative w-2/12">
        <Image
          className="rounded-xl shadow-lg"
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
          alt="thumbnail"
          fill
          priority
        />
      </div>
      <article className="w-5/12">
        <div className="font-semibold">
          <h3 className="text-2xl text-slate-300">Konser Band Dewa 19</h3>
          <p className="mt-1 text-sm text-emerald-400">JakSel, Jakarta</p>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
          tenetur enim harum, distinctio nobis vero nulla. Laudantium, inventore
          culpa. Accusamus quos iste explicabo. Dignissimos tenetur eum
          recusandae quasi officiis tempora.
        </p>
      </article>
      <div className="flex w-5/12 items-center justify-around space-x-8 px-16">
        <Price />
        <Ticket />
        <Schedule />
      </div>
    </section>
  );
};

const Price = () => (
  <section>
    <div className="relative h-14 w-14 rounded-full bg-emerald-900">
      <DollarSignIcon
        size={28}
        className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-300">
      IDR <span>500K</span>
    </p>
  </section>
);

const Ticket = () => (
  <section>
    <div className="relative h-14 w-14 rounded-full bg-emerald-900">
      <TicketIcon
        size={28}
        className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-300">
      <span>127</span> pcs left
    </p>
  </section>
);

const Schedule = () => (
  <section>
    <div className="relative h-14 w-14 rounded-full bg-emerald-900">
      <CalendarDaysIcon
        size={28}
        className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-300">26 Juni 2023</p>
  </section>
);
