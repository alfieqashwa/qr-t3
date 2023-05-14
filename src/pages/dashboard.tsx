import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { Layout } from "~/src/components/layout";

const title = "Dashboard" as const;
const DashboardPage: NextPage = () => {
  return (
    <Layout title={title}>
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
    </Layout>
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
