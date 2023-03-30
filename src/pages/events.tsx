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
      <section className="thom mx-auto">
        <H1Title title={title} />
      </section>
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
