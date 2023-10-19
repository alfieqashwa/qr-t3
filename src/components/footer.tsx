import { Heart, Copyright as CopyrightIcon } from "lucide-react"

export const Copyright = () => (
  <footer className="fixed bottom-0 z-40 w-full border-t-2 border-slate-800 bg-background py-1 shadow">
    <div className="flex h-6 items-center justify-center text-xs font-medium text-slate-300">
      <CopyrightIcon size={16} />
      <p className="pl-1">{new Date().getFullYear()} Made with</p>
      <Heart
        className="mx-1.5 animate-pulse"
        size={14}
        fill="red"
        color="red"
      />
      <span>by</span>
      <a
        className="gradient-title ml-1.5 font-bold tracking-wider text-amber-300 transition-transform duration-300 ease-in-out hover:scale-105"
        href="https://github.com/alfieqashwa"
        target="_blank"
        rel="noopener noreferrer"
      >
        Alfie Qashwa
      </a>
    </div>
  </footer>
)
