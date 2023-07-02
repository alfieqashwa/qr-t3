import { motion } from "framer-motion"
import { cn } from "~/src/utils"
import { asideVariant } from "~/src/utils/motion"
import useToggleStore from "~/store/useToggle"
import { MenuList } from "./menu-list"

export const Drawer = (): JSX.Element => {
  const { toggle } = useToggleStore()

  return (
    <motion.aside
      initial={toggle ? "initialOpen" : "initialClose"}
      animate={toggle ? "open" : "close"}
      variants={asideVariant}
      layout
      className="fixed z-40 hidden min-h-screen border-r-2 pt-28 transition duration-500 ease-in-out lg:block"
    >
      <div className="flex items-center justify-center whitespace-nowrap">
        <h3 className={cn("font-semibold", toggle ? "text-sm" : "text-xs")}>
          Main Menu
        </h3>
      </div>
      <MenuList />
    </motion.aside>
  )
}
