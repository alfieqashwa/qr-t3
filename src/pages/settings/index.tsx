import type { GetServerSideProps } from "next";
import { type NextPage } from "next";

import { H1Title } from "@/components/H1.Title";
import { Layout } from "@/src/components/layout";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { prisma } from "@/src/server/db";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import type { RouterOutputs } from "@/src/utils/api";
import { api } from "@/src/utils/api";
import { EventOrganizer } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const title = "Settings";
const SettingsPage: NextPage = () => {
  const { data: profile, isLoading } = api.user.getEOByUserId.useQuery();

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
            <EventOrganizer eo={profile?.eventOrganizer} />
          </TabsContent>
          <TabsContent value="profile">
            <Profile profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

type EventOrganizerProps = {
  eo?: EventOrganizer | null;
};

function EventOrganizer({ eo }: EventOrganizerProps) {
  const createdAt = dayjs(eo?.createdAt).format("dddd, DD MMMM YYYY, HH:mm");
  const updateAt = dayjs().to(dayjs(eo?.updatedAt));

  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">
        {eo?.name}
      </h1>
      <h4 className="mt-2 text-slate-400">
        Information of your Event Organizer.
      </h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-8">
        {!!eo ? (
          <article className="flex flex-col space-y-6">
            <div>
              <Field label="phone" value={eo.phone} />
              <Field label="street" value={eo.street} />
            </div>
            <div>
              <Field label="province" value={eo.province} />
              <Field label="regency" value={eo.regency} />
              <Field label="district" value={eo.district} />
              <Field label="village" value={eo.village} />
            </div>
            <div>
              {/* // TODO */}
              <small className="text-rose-400">
                TODOS: only Dewa and Admin who can see this!
              </small>
              <Field label="Created At" value={createdAt} />
              <Field label="Updated At" value={updateAt} />
              <Field label="ID" value={eo.id} />
            </div>
          </article>
        ) : null}
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string | null;
};

function Field(props: FieldProps) {
  const value = props.value ? props.value : "";

  return (
    <div className="space-x-2">
      <small className="text-lg font-semibold capitalize">{props.label}:</small>
      <small className="text-lg font-semibold capitalize">{value}</small>
    </div>
  );
}

type ProfileProps = {
  profile?: RouterOutputs["user"]["getEOByUserId"];
};

function Profile({ profile }: ProfileProps) {
  return (
    <div className="border border-slate-700">
      Change your profile here.
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}

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

  const eoId = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { eventOrganizerId: true },
  });

  if (!eoId?.eventOrganizerId) {
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
