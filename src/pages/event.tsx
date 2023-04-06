import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";

const title = "Events";
const EventsPage: NextPage = () => {
  return (
    <LayoutDashboard title={title}>
      <H1Title title={title} />
      <div className="kurt mt-4 grid h-[calc(100vh_-_18vh)] grid-cols-7 gap-8">
        <section className="col-span-5 flex h-16 w-full items-center justify-evenly rounded-xl bg-slate-800 p-6 shadow-lg">
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
        </section>
        <section className="col-span-2 grid h-16 place-content-center rounded-xl bg-emerald-700 p-6 shadow-lg">
          <h2 className="font-bold">Generate Order Report</h2>
        </section>
        <section className="col-span-7 grid grid-cols-2 gap-8 ">
          <div className="col-span-2 rounded-xl bg-slate-800 p-6 shadow-lg">
            <h2>Table</h2>
          </div>
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
