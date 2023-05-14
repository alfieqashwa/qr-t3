import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { Layout } from "@/src/components/layout";

import { authOptions } from "@/server/auth";
import { AdminAndDewaOnly } from "@/src/components/Authed/AdminAndDewaOnly";
import { EOInfo, ProfileInfo, TeamInfo } from "@/src/components/settings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { getServerSession } from "next-auth/next";

const title = "Settings" as const;

const SettingsPage: NextPage = () => {
  return (
    <Layout title={title}>
      <H1Title title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <Tabs defaultValue="event-organizer">
          <TabsList className="mb-6">
            <TabsTrigger value="event-organizer">Event Organizer</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <AdminAndDewaOnly>
              <TabsTrigger value="team-info">Team Info</TabsTrigger>
            </AdminAndDewaOnly>
          </TabsList>
          <TabsContent value="event-organizer">
            <EOInfo />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileInfo />
          </TabsContent>
          <TabsContent value="team-info">
            <TeamInfo />
          </TabsContent>
        </Tabs>
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
