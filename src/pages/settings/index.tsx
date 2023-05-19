import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { HeaderTitle } from "~/src/components/HeaderTitle";
import { Layout } from "~/src/components/layout";

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { AdminOnly } from "~/src/components/authed";
import { EOInfo, ProfileInfo, TeamInfo } from "~/src/components/settings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/src/components/ui/tabs";

const title = "Settings" as const;

const SettingsPage: NextPage = () => {
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="h-[calc(100vh_-_17vh)]">
        <Tabs defaultValue="event-organizer">
          <TabsList className="mb-3">
            <TabsTrigger className="text-xs lg:text-sm" value="event-organizer">
              Event Organizer
            </TabsTrigger>
            <TabsTrigger className="text-xs lg:text-sm" value="profile">
              Profile
            </TabsTrigger>
            <AdminOnly>
              <TabsTrigger className="text-xs lg:text-sm" value="team-info">
                Team Info
              </TabsTrigger>
            </AdminOnly>
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
