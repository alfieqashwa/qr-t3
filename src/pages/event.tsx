import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import EventCard from "../components/EventCard";

const title = "Events";
const EventPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): JSX.Element => {
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
        <section className="grid h-auto grid-cols-1 gap-8 py-8">
          <EventCard imgUrl="/img/event-thumbnail.avif" />
          <EventCard imgUrl="/img/event-thumbnail.avif" />
        </section>
      </div>
    </LayoutDashboard>
  );
};

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

export default EventPage;
