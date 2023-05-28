import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { HeaderTitle } from "~/src/components/header-title";
import { Layout } from "~/src/components/layout";

import { getServerSession } from "next-auth/next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authOptions } from "~/server/auth";
import { EventList } from "~/src/components/event-list";
// import { TicketList } from "~/src/components/ticket-list";
import { TicketList } from "~/src/components/ticket-list";
import { DataListSample } from "~/src/components/table-list-sample";
import { api } from "~/src/utils/api";
import { LoadingSpinner } from "~/src/components/loading";

const title = "Events" as const;
const EventPage: NextPage = (): JSX.Element => {
  const events = api.event.getAll.useQuery();
  const tickets = api.ticket.getAll.useQuery();

  if (events.isLoading || tickets.isLoading) return <LoadingSpinner />;
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        {events.status === "success" && tickets.status === "success" && (
          <Tabs defaultValue="event-list">
            <TabsList className="mb-3">
              <TabsTrigger className="text-xs lg:text-sm" value="event-list">
                Event
              </TabsTrigger>
              <TabsTrigger
                className="text-xs lg:text-sm"
                value="ticket-list"
                disabled={events.data.length === 0}
              >
                Ticket
              </TabsTrigger>
              <TabsTrigger className="text-xs lg:text-sm" value="visitor">
                Visitor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="event-list">
              <EventList events={events.data} />
            </TabsContent>
            <TabsContent value="ticket-list">
              <TicketList tickets={tickets.data} />
            </TabsContent>
            <TabsContent value="visitor">
              <DataListSample />
              {/* <TicketList /> */}
            </TabsContent>
          </Tabs>
        )}
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
