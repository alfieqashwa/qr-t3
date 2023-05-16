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
    <section className="flex w-full flex-col rounded-xl bg-zinc-900 p-3 shadow-lg lg:flex-row lg:space-x-6 lg:p-6">
      <div className="relative h-40 w-full lg:h-auto lg:w-2/12">
        <Image
          className="rounded-xl shadow-lg"
          src={imgUrl}
          alt="thumbnail"
          fill
          priority
        />
      </div>
      <article className="mt-4 lg:mt-0 lg:w-5/12">
        <div className="font-semibold">
          <h3 className="text-xl text-slate-300 lg:text-2xl">
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
      <div className="mt-4 flex items-center justify-center space-x-6 lg:mt-0 lg:w-5/12 lg:justify-around lg:space-x-8 lg:px-16">
        <Price />
        <Ticket />
        <Schedule />
      </div>
    </section>
  );
}
