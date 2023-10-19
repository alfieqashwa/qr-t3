import { motion } from "framer-motion"
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
      className="fixed z-40 hidden min-h-screen border-r-2 border-slate-800 pt-28 lg:block"
    >
      <MenuList />
    </motion.aside>
  )
}
