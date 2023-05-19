import React from "react";
import Image from "next/image";
import { Price } from "./Price";
import { Schedule } from "./Schedule";
import { Ticket } from "./Ticket";

/**
// ?WIP DATA:
    Ticket Type
    Image URL
    Title
    Location
    Description
    Price
    Sum of ticket left
    Event date
 */

type EventCardProps = {
  imgUrl: string;
};

export default function EventCard({ imgUrl }: EventCardProps) {
  return (
    <section className="flex w-full flex-col rounded-xl bg-zinc-900 p-3 shadow-lg xl:flex-row xl:space-x-6 xl:p-6">
      <div className="relative h-40 w-full xl:h-auto xl:w-60">
        <Image
          className="rounded-xl object-cover shadow-lg"
          src={imgUrl}
          alt="thumbnail"
          fill
          priority
        />
      </div>
      <article className="mt-4 xl:mt-0 xl:w-5/12">
        <div className="font-semibold">
          <h3 className="text-xl text-slate-300 xl:text-2xl">
            Konser Band Dewa 19
          </h3>
          <p className="mt-1 text-sm text-emerald-400">JakSel, Jakarta</p>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
          tenetur enim harum, distinctio nobis vero nulla. Laudantium, inventore
          culpa. Accusamus quos iste explicabo. Dignissimos tenetur eum
          recusandae quasi officiis tempora.
        </p>
      </article>
      <div className="mt-4 flex items-center justify-center space-x-6 xl:mt-0 xl:w-5/12 xl:justify-around xl:space-x-8 xl:px-16">
        <Price />
        <Ticket />
        <Schedule />
      </div>
    </section>
  );
}
