import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AdminAndDewaOnly({ children }: Props): JSX.Element | null {
  const { data: session } = useSession();

  if (session?.user.role === Role.ADMIN || session?.user.role === Role.DEWA) {
    return <>{children}</>;
  }
  return null;
}
