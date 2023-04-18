import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

const title = "Settings";
const SettingsPage: NextPage = () => {
  return (
    <LayoutDashboard title={title}>
      <H1Title title={title} />
      <div className="kurt mt-4 h-[calc(100vh_-_17vh)]"></div>
    </LayoutDashboard>
  );
};

export default SettingsPage;

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
