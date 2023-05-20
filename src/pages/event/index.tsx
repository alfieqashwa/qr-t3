import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { HeaderTitle } from "~/src/components/HeaderTitle";
import { Layout } from "~/src/components/layout";

import { getServerSession } from "next-auth/next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authOptions } from "~/server/auth";
import { EventList } from "~/src/components/event-list";
import { api } from "~/src/utils/api";
import { LoadingSpinner } from "~/src/components/Loading";

const title = "Events" as const;
const EventPage: NextPage = (): JSX.Element => {
  const { data: tickets, isLoading } = api.ticket.getAll.useQuery();

  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        {isLoading && <LoadingSpinner />}
        <Tabs defaultValue="event-list">
          <TabsList className="mb-3">
            <TabsTrigger className="text-xs lg:text-sm" value="event-list">
              Event
            </TabsTrigger>
            <TabsTrigger className="text-xs lg:text-sm" value="ticket">
              Ticket
            </TabsTrigger>
            <TabsTrigger className="text-xs lg:text-sm" value="visitor">
              Visitor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="event-list">
            <EventList />
          </TabsContent>
          <TabsContent value="ticket">
            <div>
              <h1>Ticket</h1>
              <pre>{JSON.stringify(tickets, null, 2)}</pre>
            </div>
          </TabsContent>
          <TabsContent value="visitor">
            <h1>VISITOR</h1>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

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

export default EventPage;
