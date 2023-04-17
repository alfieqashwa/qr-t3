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
    <section className="flex w-full space-x-6 rounded-xl bg-zinc-900 p-6 shadow-lg">
      <div className="relative w-2/12">
        <Image
          className="rounded-xl shadow-lg"
          src={imgUrl}
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
}
