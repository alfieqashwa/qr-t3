import useToggleStore from "@/src/store/useToggle";
import { titleVariant } from "@/src/utils/motion";
import { motion } from "framer-motion";
import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const LINKS = [
  {
    path: "dashboard",
    icon: <LayoutDashboard className="shrink-0" />,
  },
  {
    path: "event",
    icon: <Calendar className="shrink-0" />,
  },
  {
    path: "visitor",
    icon: <Users className="shrink-0" />,
  },
  {
    path: "settings",
    icon: <Settings className="shrink-0" />,
  },
];

export const MenuList = () => {
  const { toggle } = useToggleStore();
  const { pathname } = useRouter();
  return (
    <ul className="mt-8 space-y-2 px-1.5">
      {LINKS?.map((link) => (
        <li
          className={`${
            pathname === `/${link.path}`
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
          key={link.path}
        >
          <Link
            href={`/${link.path}`}
            className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            {link.icon}
            {/* <LayoutDashboard className="shrink-0" /> */}
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={titleVariant}
              className="font-semibold capitalize tracking-wider"
            >
              {link.path}
            </motion.h3>
          </Link>
        </li>
      ))}
    </ul>
  );
};
