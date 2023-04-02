"use client";

import { motion } from "framer-motion";

import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import useToggleStore from "@/store/useToggle";
import { useRouter } from "next/router";
import { asideVariant, titleVariant } from "@/src/utils/motion";

export const Drawer = () => {
  const { toggle } = useToggleStore();
  const { pathname } = useRouter();

  return (
    <motion.aside
      initial={toggle ? "initialOpen" : "initialClose"}
      animate={toggle ? "open" : "close"}
      variants={asideVariant}
      layout
      className="fixed z-40 min-h-screen border-r-2 border-slate-700 bg-gradient-to-b from-black to-slate-900 pt-28 transition duration-500 ease-in-out"
    >
      <ul className="space-y-2 px-1.5">
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
              variants={titleVariant}
              className="font-semibold tracking-wider"
            >
              Dashboard
            </motion.h3>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/event"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/event"
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
              variants={titleVariant}
              className={`font-semibold tracking-wider`}
            >
              Event
            </motion.h3>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/visitor"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/visitor"
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
              variants={titleVariant}
              className="font-semibold tracking-wider"
            >
              Visitor
            </motion.h3>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/setting"
              ? "rounded-xl border-r-2 border-b-2 border-amber-200 text-amber-300"
              : ""
          }`}
        >
          <Link
            href="/setting"
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
              variants={titleVariant}
              className="font-semibold tracking-wider"
            >
              Setting
            </motion.h3>
          </Link>
        </li>
      </ul>
    </motion.aside>
  );
};
