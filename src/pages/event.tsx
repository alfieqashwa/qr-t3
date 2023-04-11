import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import Image from "next/image";
import { CalendarDays, DollarSign, Ticket } from "lucide-react";

const title = "Events";
const EventsPage: NextPage = () => {
  return (
    <LayoutDashboard title={title}>
      <H1Title title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <section className="flex w-full justify-center space-x-8">
          <div className="flex h-16 w-2/3 items-center justify-evenly rounded-xl bg-slate-800 p-6 shadow-lg">
            <div>
              <h2>Income</h2>
            </div>
            <div>
              <h2>Event</h2>
            </div>
            <div>
              <h2>Visitor</h2>
            </div>
            <div>
              <h2>This Week</h2>
            </div>
          </div>
          <button className="grid h-16 w-1/3 place-content-center rounded-xl bg-emerald-700 p-6 shadow-lg">
            <h2 className="font-semibold">Generate Order Report</h2>
          </button>
        </section>
        <section className="grid h-auto grid-cols-1 gap-8 rounded-xl py-8 shadow-lg">
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </section>
      </div>
    </LayoutDashboard>
  );
};

export default EventsPage;

// If No Authenticated, then redirect to Home Page. Else, enter this page.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

const EventCard = () => {
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
        <section>
          <div className="relative h-14 w-14 rounded-full bg-emerald-900">
            <Ticket
              size={28}
              className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-300">
            <span>127</span> pcs left
          </p>
        </section>
        <section>
          <div className="relative h-14 w-14 rounded-full bg-emerald-900">
            <CalendarDays
              size={28}
              className="absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-300">
            26 Juni 2023
          </p>
        </section>
      </div>
    </section>
  );
};
