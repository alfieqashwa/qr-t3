import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Link from "next/link";

import { H1Title } from "@/components/H1.Title";
import { LayoutDashboard } from "@/components/LayoutDashboard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";

const Dashboard: NextPage = () => {
  return (
    <LayoutDashboard>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <H1Title />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/"
          >
            <h3 className="text-2xl font-bold">Home →</h3>
            <div className="text-lg">Just the basics - Go Home</div>
          </Link>
        </div>
        <div className="text-slate-200"></div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam debitis
          maxime sunt esse, tenetur molestiae? Dolore amet veritatis omnis
          voluptatibus consequuntur, nostrum eligendi et reiciendis vel at
          accusantium distinctio officiis?
        </p>
      </div>
    </LayoutDashboard>
  );
};

export default Dashboard;

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

  return {
    props: {
      session,
    },
  };
};
