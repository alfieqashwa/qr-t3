"use client";

import { motion } from "framer-motion";

import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import useToggleStore from "@/store/useToggle";
import { useRouter } from "next/router";

const aside = {
  initialClose: { width: 96 },
  initialOpen: { width: 224 },
  open: {
    width: 224,
    transition: {
      duration: 1,
      type: "spring",
    },
  },
  close: {
    width: 96,
    transition: {
      duration: 1,
      type: "spring",
    },
  },
};

const head3 = {
  initialClose: {
    fontSize: "0.625rem",
  },
  initialOpen: {
    fontSize: "1rem",
  },
  open: {
    fontSize: "1rem",
    transition: {
      duration: 1,
      type: "spring",
    },
  },
  close: {
    fontSize: "0.625rem",
    transition: {
      duration: 1,
      type: "spring",
    },
  },
};

export const Drawer = () => {
  const { toggle } = useToggleStore();
  const { pathname } = useRouter();

  return (
    <motion.aside
      initial={toggle ? "initialOpen" : "initialClose"}
      animate={toggle ? "open" : "close"}
      variants={aside}
      layout
      className="fixed z-40 min-h-screen border-r-2 border-slate-700 bg-gradient-to-b from-black to-slate-900 pt-28 transition duration-500 ease-in-out"
    >
      <ul className="space-y-2 px-1">
        <li
          className={`${
            pathname === "/dashboard"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <LayoutDashboard className="shrink-0" />
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={head3}
              className="font-semibold tracking-wider"
            >
              Dashboard
            </motion.h3>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/events"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/events"
            className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <Calendar className="shrink-0" />
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={head3}
              className={`font-semibold tracking-wider`}
            >
              Events
            </motion.h3>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/visitors"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/visitors"
            className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <Users className="shrink-0" />
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={head3}
              className="font-semibold tracking-wider"
            >
              Visitors
            </motion.h3>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/settings"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/settings"
            className={`flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-zinc-800 ${
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            }`}
          >
            <Settings className="shrink-0" />
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={head3}
              className="font-semibold tracking-wider"
            >
              Settings
            </motion.h3>
          </Link>
        </li>
      </ul>
    </motion.aside>
  );
};
