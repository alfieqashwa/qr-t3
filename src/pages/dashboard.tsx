import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type NextPage } from "next";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

const title = "Dashboard";
const DashboardPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: sessionData } = useSession();
  const eoId = api.user.getEOIdByUser.useQuery({
    id: sessionData?.user.email as string,
  });
  return (
    <LayoutDashboard title={title}>
      {!eoId.data?.eventOrganizerId ? (
        <div className="thom mt-8 h-[calc(100vh_-_17vh)]">NO EO ID</div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-8">
          <section className="col-span-1 grid grid-cols-2 gap-8 ">
            <div className="col-span-2 h-80 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>The Best Selling</h2>
            </div>
            <div className="col-span-1 h-32 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>The Best Selling</h2>
            </div>
            <div className="col-span-1 h-32 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>Lorem ipsum dolor</h2>
            </div>
            <div className="col-span-1 h-32 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>Lorem ipsum dolor</h2>
            </div>
            <div className="col-span-1 h-32 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>Lorem ipsum dolor</h2>
            </div>
          </section>
          <section className="col-span-1 grid grid-cols-2 gap-8">
            <div className="col-span-2 h-80 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>Lorem ipsum dolor</h2>
            </div>
            <div className="col-span-2 h-60 rounded-xl bg-slate-800 p-6 shadow-lg">
              <h2>Lorem ipsum dolor</h2>
            </div>
          </section>
        </div>
      )}
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
