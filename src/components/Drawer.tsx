"use client";

import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";

type DrawerProps = {
  isToggle?: boolean;
};

export const Drawer = ({ isToggle }: DrawerProps) => (
  <aside
    className={`fixed z-40 min-h-screen border-r-2 border-slate-700 bg-gradient-to-b from-black to-slate-900 pt-28 transition duration-500 ease-in-out ${
      isToggle ? "" : "w-[224px]"
    }`}
  >
    <ul className="px-1">
      <li>
        <Link
          href="/dashboard"
          className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle
              ? "flex-col justify-end space-y-3 px-2"
              : "flex-row space-x-6 px-6"
          }`}
        >
          <LayoutDashboard />
          <h3
            className={`font-semibold tracking-wider ${
              isToggle ? "text-[0.625rem]" : "text-base "
            }`}
          >
            Dashboard
          </h3>
        </Link>
      </li>
      <li>
        <Link
          href="/events"
          className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle
              ? "flex-col justify-end space-y-3 px-2"
              : "flex-row space-x-6 px-6"
          }`}
        >
          <Calendar />
          <h3
            className={`font-semibold tracking-wider ${
              isToggle ? "text-[0.625rem]" : "text-base "
            }`}
          >
            Events
          </h3>
        </Link>
      </li>
      <li>
        <Link
          href="/visitors"
          className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle
              ? "flex-col justify-end space-y-3 px-2"
              : "flex-row space-x-6 px-6"
          }`}
        >
          <Users />
          <h3
            className={`font-semibold tracking-wider ${
              isToggle ? "text-[0.625rem]" : "text-base "
            }`}
          >
            Visitors
          </h3>
        </Link>
      </li>
      <li>
        <Link
          href="/settings"
          className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle
              ? "flex-col justify-end space-y-3 px-2"
              : "flex-row space-x-6 px-6"
          }`}
        >
          <Settings />
          <h3
            className={`font-semibold tracking-wider ${
              isToggle ? "text-[0.625rem]" : "text-base "
            }`}
          >
            Settings
          </h3>
        </Link>
      </li>
    </ul>
  </aside>
);
