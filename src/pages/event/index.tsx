import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { EventList, TicketList } from "~/components/events";
import { HeaderTitle } from "~/components/header-title";
import { Layout } from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import { DataListSample } from "~/components/table-list-sample";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

const title = "Events" as const;
const EventPage: NextPage = (): JSX.Element => {
  const events = api.event.getAll.useQuery();
  const tickets = api.ticket.getAll.useQuery();

  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        {events.isLoading || (tickets.isLoading && <LoadingSpinner />)}
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
