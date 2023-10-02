import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { linkList } from "~/src/constants/link-list"
import { cn } from "~/src/utils"
import { titleVariant } from "~/src/utils/motion"
import { SlugContext } from "~/store/slug-context-provider"
import useToggleStore from "~/store/useToggle"

export const MenuList = (): JSX.Element => {
  const { pathname } = useRouter()
  const { toggle } = useToggleStore()
  const { slug } = useContext(SlugContext)

  return (
    <ul className="space-y-2 px-1.5">
      {linkList.map((link) => (
        <li
          className={`rounded-xl border-b border-r border-slate-700 ${
            pathname === `/[slug]/${link.path}`
              ? "bg-muted text-amber-300"
              : "bg-background"
          }`}
          key={link.path}
        >
          <Link
            href={`/${slug as string}/${link.path}`}
            className={cn(
              "flex items-center rounded-xl py-3 hover:bg-accent",
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            )}
          >
            {link.iconDefault}
            {/* <LayoutDashboard className="shrink-0" /> */}
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={titleVariant}
              className="font-semibold capitalize tracking-wider"
            >
              {link.title}
            </motion.h3>
          </Link>
        </li>
      ))}
    </ul>
  )
}
