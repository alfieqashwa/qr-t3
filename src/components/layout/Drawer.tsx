import { asideVariant } from "@/src/utils/motion";
import useToggleStore from "@/store/useToggle";
import { motion } from "framer-motion";
import { MenuList } from "./MenuList";

export const Drawer = () => {
  const { toggle } = useToggleStore();

  return (
    <motion.aside
      initial={toggle ? "initialOpen" : "initialClose"}
      animate={toggle ? "open" : "close"}
      variants={asideVariant}
      layout
      className="fixed z-40 min-h-screen border-r-2 border-slate-700 bg-gradient-to-b from-black to-slate-900 pt-28 transition duration-500 ease-in-out"
    >
      <div className="flex items-center justify-center whitespace-nowrap">
        <h3
          className={`font-semibold text-zinc-400 ${
            toggle ? "text-sm" : "text-xs"
          }`}
        >
          Main Menu
        </h3>
      </div>
      <MenuList />
    </motion.aside>
  );
};
