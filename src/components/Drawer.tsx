"use client";

import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import useToggleStore from "@/store/useToggle";

export const Drawer = () => {
  const { toggle } = useToggleStore();
  return (
    <aside
      className={`fixed z-40 min-h-screen border-r-2 border-slate-700 bg-gradient-to-b from-black to-slate-900 pt-28 transition duration-500 ease-in-out ${
        toggle ? "" : ""
      }`}
    >
      <ul className="px-1">
        <li>
          <Link
            href="/dashboard"
            className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <LayoutDashboard />
            <h3
              className={`font-semibold tracking-wider ${
                toggle ? "text-base " : "text-[0.625rem]"
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
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <Calendar />
            <h3
              className={`font-semibold tracking-wider ${
                toggle ? "text-base" : "text-[0.625rem]"
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
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <Users />
            <h3
              className={`font-semibold tracking-wider ${
                toggle ? "text-base" : "text-[0.625rem]"
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
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <Settings />
            <h3
              className={`font-semibold tracking-wider ${
                toggle ? "text-base" : "text-[0.625rem]"
              }`}
            >
              Settings
            </h3>
          </Link>
        </li>
      </ul>
    </aside>
  );
};
