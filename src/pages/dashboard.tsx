import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Link from "next/link";

import { H1Title } from "@/components/H1.Title";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard";

const title = "Dashboard";
const DashboardPage: NextPage = () => {
  return (
    <LayoutDashboard title={title}>
      <H1Title title={title} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="/"
        >
          <h3 className="text-2xl font-bold">Home →</h3>
          <div className="text-lg">Just the basics - Go Home</div>
        </Link>
      </div>
    </LayoutDashboard>
  );
};

export default DashboardPage;

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
