import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "~/components/H1.Title";
import { Layout } from "~/src/components/layout";

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

const title = "Visitors" as const;

const VisitorsPage: NextPage = () => {
  return (
    <Layout title={title}>
      <H1Title title={title} />
      <div className="kurt mt-4 h-[calc(100vh_-_17vh)]"></div>
    </Layout>
  );
};

export default VisitorsPage;

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
