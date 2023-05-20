import Image from "next/image";
import type { RouterOutputs } from "~/src/utils/api";

/**
// ?WIP DATA:
    Ticket Type
    Image URL
    Title
    Location
    Price
    Sum of ticket left
    Event date
 */

type EventCardProps = {
  event: RouterOutputs["event"]["getAll"][0];
};

const DEFAULT_IMAGE = "/img/event-thumbnail.avif";

export default function EventCard({ event }: EventCardProps) {
  return (
    <section className="flex w-full flex-col rounded-xl bg-zinc-900 p-3 shadow-lg xl:flex-row xl:space-x-6 xl:p-6">
      <div className="relative h-40 w-full xl:h-auto xl:w-60">
        <Image
          className="rounded-xl object-cover shadow-lg"
          src={event.thumbnail ?? DEFAULT_IMAGE}
          alt="thumbnail"
          fill
          priority
        />
      </div>
      <article className="mt-4 xl:mt-0 xl:w-5/12">
        <div className="font-semibold">
          <h3 className="text-xl capitalize text-slate-300 xl:text-2xl">
            {event.title}
          </h3>
          <p className="mt-1 text-sm capitalize text-emerald-400">
            {event.location}
          </p>
        </div>
      </article>
      <div className="mt-4 flex items-center justify-center space-x-6 xl:mt-0 xl:w-5/12 xl:justify-around xl:space-x-8 xl:px-16"></div>
    </section>
  );
}
