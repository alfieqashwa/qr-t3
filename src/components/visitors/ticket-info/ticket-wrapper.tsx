import { cn } from "~/src/utils"

type WrapperProps = {
  title: string
  className?: string
  children: React.ReactNode
}

export const Wrapper = ({ title, className, children }: WrapperProps) => (
  <article className={cn("px-2 font-medium", className)}>
    <h2 className="text-center text-lg uppercase md:text-xl">{title}</h2>
    <div className={"flex flex-col items-center text-sm md:text-base"}>
      {children}
    </div>
  </article>
)
