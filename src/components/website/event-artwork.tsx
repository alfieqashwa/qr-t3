import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import { CountdownTimer } from "~/components/countdownTimer"
import { cn } from "~/src/utils"
import { type RouterOutputs } from "~/utils/api"

interface EventArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  event: RouterOutputs["event"]["getAllByEventOrganizerIdPublic"][0]
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function EventArtwork({
  event,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: EventArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Image
          src={
            event.thumbnail ??
            "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80"
          }
          alt={event.title}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        />
      </div>
      <div className="text-md font-bold capitalize">
        <h3 className="font-medium leading-none">{event.title}</h3>
        <div className="my-1 text-sm font-semibold text-muted-foreground">
          <p>venue: {event.venue}</p>
          <p>location: {format(event.date, "PPPP", { locale: id })}</p>
        </div>
        <CountdownTimer date={event.date} />
      </div>
    </div>
  )
}
