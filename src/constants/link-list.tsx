import { Calendar, Home, LayoutDashboard, Settings, Users } from "lucide-react"

export const linkList = [
  {
    path: "",
    title: "home",
    iconDefault: <Home className="shrink-0" />,
    iconSmall: <Home size={18} className="shrink-0" />,
  },
  {
    path: "dashboard",
    title: "dashboard",
    iconDefault: <LayoutDashboard className="shrink-0" />,
    iconSmall: <LayoutDashboard size={18} className="shrink-0" />,
  },
  {
    path: "event",
    title: "event",
    iconDefault: <Calendar className="shrink-0" />,
    iconSmall: <Calendar size={18} className="shrink-0" />,
  },
  {
    path: "visitor",
    title: "visitor",
    iconDefault: <Users className="shrink-0" />,
    iconSmall: <Users size={18} className="shrink-0" />,
  },
  {
    path: "settings",
    title: "settings",
    iconDefault: <Settings className="shrink-0" />,
    iconSmall: <Settings size={18} className="shrink-0" />,
  },
] as const
