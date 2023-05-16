import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { HeaderTitle } from "~/src/components/HeaderTitle";
import { Layout } from "~/src/components/layout";

import { getServerSession } from "next-auth/next";
import EventCard from "~/components/EventCard";
import { authOptions } from "~/server/auth";

const title = "Events" as const;
const EventPage: NextPage = (): JSX.Element => {
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <section className="flex w-full flex-col justify-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-8">
          <div className="flex h-16 items-center justify-evenly rounded-xl bg-slate-800 p-6 shadow-lg lg:w-2/3">
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
              <h2 className="whitespace-nowrap">This Week</h2>
            </div>
          </div>
          <button className="mx-auto grid h-16 w-2/3 place-content-center rounded-xl bg-emerald-700 p-6 shadow-lg lg:w-1/3">
            <h2 className="whitespace-nowrap font-semibold">
              Generate Order Report
            </h2>
          </button>
        </section>

        <section className="mt-2 grid h-auto grid-cols-1 gap-4 py-4 lg:mt-0 lg:gap-8 lg:py-8">
          <EventCard imgUrl="/img/event-thumbnail.avif" />
          <EventCard imgUrl="/img/event-thumbnail.avif" />
        </section>
      </div>
    </Layout>
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

  // If user has not have EventOrganizerId, then redirect to page "/settings/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/settings/create-eo",
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
