"use client";

import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";

type DrawerProps = {
  isToggle: boolean;
};

export const Drawer = ({ isToggle }: DrawerProps) => (
  <aside
    className={`fixed z-30 min-h-screen border-r border-slate-900 bg-gradient-to-b from-black to-slate-900 pt-28 ${
      isToggle ? "w-[128px]" : "w-[256px]"
    }`}
  >
    <ul>
      <li>
        <Link
          href="/dashboard"
          className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800"
        >
          <LayoutDashboard className={`${isToggle ? "mx-auto" : ""}`} />
          {!isToggle && (
            <h3 className="font-semibold tracking-wider">Dashboard</h3>
          )}
        </Link>
      </li>
      <li>
        <Link
          href="/events"
          className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800"
        >
          <Calendar className={`${isToggle ? "mx-auto" : ""}`} />
          {!isToggle && (
            <h3 className="font-semibold tracking-wider">Events</h3>
          )}
        </Link>
      </li>
      <li>
        <Link
          href="/visitors"
          className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800"
        >
          <Users className={`${isToggle ? "mx-auto" : ""}`} />
          {!isToggle && (
            <h3 className="font-semibold tracking-wider">Visitors</h3>
          )}
        </Link>
      </li>
      <li>
        <Link
          href="/settings"
          className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800"
        >
          <Settings className={`${isToggle ? "mx-auto" : ""}`} />
          {!isToggle && (
            <h3 className="font-semibold tracking-wider">Settings</h3>
          )}
        </Link>
      </li>
    </ul>
  </aside>
);
