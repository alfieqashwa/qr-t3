import { cn } from "~/src/utils"

type WrapperProps = {
  title: string
  className?: string
  children: React.ReactNode
}

export const Wrapper = (props: WrapperProps) => (
  <article className={cn("px-2 font-medium", props.className)}>
    <h2 className="text-center text-xl uppercase md:text-2xl">{props.title}</h2>
    <div className={"flex flex-col items-center pb-4 md:text-lg"}>
      {props.children}
    </div>
  </article>
)
