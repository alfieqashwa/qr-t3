"use client";

import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";

type DrawerProps = {
  isToggle: boolean;
};

export const Drawer = ({ isToggle }: DrawerProps) => (
  <aside
    className={`fixed z-40 min-h-screen border-r-2 border-slate-700 bg-gradient-to-b from-black to-slate-900 pt-28 transition duration-500 ease-in-out ${
      isToggle ? "" : "w-[224px]"
    }`}
  >
    <ul>
      <li>
        <Link
          href="/dashboard"
          className={`flex items-center space-x-6 rounded-xl px-6 py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle ? "justify-end" : ""
          }`}
        >
          <LayoutDashboard />
          <h3
            className={`text-base font-semibold tracking-wider ${
              isToggle ? "hidden" : ""
            }`}
          >
            Dashboard
          </h3>
        </Link>
      </li>
      <li>
        <Link
          href="/events"
          className={`flex items-center space-x-6 rounded-xl px-6 py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle ? "justify-end" : ""
          }`}
        >
          <Calendar />
          <h3
            className={`text-base font-semibold tracking-wider ${
              isToggle ? "hidden" : ""
            }`}
          >
            Events
          </h3>
        </Link>
      </li>
      <li>
        <Link
          href="/visitors"
          className={`flex items-center space-x-6 rounded-xl px-6 py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle ? "justify-end" : ""
          }`}
        >
          <Users />
          <h3
            className={`text-base font-semibold tracking-wider ${
              isToggle ? "hidden" : ""
            }`}
          >
            Visitors
          </h3>
        </Link>
      </li>
      <li>
        <Link
          href="/settings"
          className={`flex items-center space-x-6 rounded-xl px-6 py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
            isToggle ? "justify-end" : ""
          }`}
        >
          <Settings />
          <h3
            className={`text-base font-semibold tracking-wider ${
              isToggle ? "hidden" : ""
            }`}
          >
            Settings
          </h3>
        </Link>
      </li>
    </ul>
  </aside>
);
