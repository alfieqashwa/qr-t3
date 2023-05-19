import { AddNewEvent } from "./AddNewEvent";
import EventCard from "./event-card";

export const EventList = () => (
  <div>
    <header className="flex justify-end">
      <AddNewEvent />
    </header>
    <div className="mt-4 border-t-2 border-slate-800"></div>
    <section className="mt-2 grid h-auto grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:mt-0 lg:gap-8 lg:py-8 xl:grid-cols-1">
      <EventCard imgUrl="/img/event-thumbnail.avif" />
      <EventCard imgUrl="/img/event-thumbnail.avif" />
    </section>
  </div>
);
