import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { HeaderTitle } from "~/src/components/HeaderTitle";
import { Layout } from "~/src/components/layout";

import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { prisma } from "~/src/server/db";

const title = "Dewa";
const SettingsPage: NextPage = () => {
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <h3>{title} is here...</h3>
      </div>
    </Layout>
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isDewa = user && user.role === Role.DEWA;
  // console.log({ isDewa });

  // sample authorization based on user.role
  if (!isDewa) {
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
