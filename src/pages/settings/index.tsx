import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { Layout } from "@/src/components/layout";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { api } from "@/src/utils/api";
import { EOInfo, ProfileInfo } from "@/src/components/settings";
import { useSession } from "next-auth/react";

const title = "Settings" as const;

const SettingsPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: profile, isLoading } = api.user.getEOByUserId.useQuery();

  const userRole = session?.user.role;

  return (
    <Layout title={title}>
      {isLoading && <p>Loading...</p>}
      <H1Title title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <Tabs defaultValue="event-organizer">
          <TabsList className="mb-6">
            <TabsTrigger value="event-organizer">Event Organizer</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="event-organizer">
            <EOInfo eo={profile?.eventOrganizer} userRole={userRole} />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileInfo profile={profile} userRole={userRole} />
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
