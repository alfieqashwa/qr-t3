import { useEffect, useState } from "react"
import { cn } from "../utils"

type CountdownTimerProps = {
  date: Date
  className?: string
}
// Source: https://github.com/TomDoesTech/Countdown-Timer/blob/main/pages/index.tsx
export const CountdownTimer = ({ date, className }: CountdownTimerProps) => {
  const [partyTime, setPartyTime] = useState(false)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const difference = date.getTime() - now.getTime()

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      setDays(d)

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      setHours(h)

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      setMinutes(m)

      const s = Math.floor((difference % (1000 * 60)) / 1000)
      setSeconds(s)

      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        setPartyTime(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return (
    <>
      {!partyTime && (
        <div
          className={cn(
            "flex items-center justify-center p-2 text-base font-semibold",
            className,
          )}
        >
          <TimeCard time={days} label="Days" />
          <Divider />
          <TimeCard time={hours} label="Hours" />
          <Divider />
          <TimeCard time={minutes} label="Mins" />
          <Divider />
          <TimeCard time={seconds} label="Secs" />
        </div>
      )}
    </>
  )
}

const TimeCard = ({ time, label }: { time: number; label: string }) => {
  const formattedTime = time.toString().padStart(2, "0")
  const singularLabel = label.slice(0, -1)
  return (
    <div className="space-x-1">
      <span className="text-amber-300">{formattedTime}</span>
      <span className="text-primary-foreground">
        {time === 1 ? singularLabel : label}
      </span>
    </div>
  )
}
const Divider = () => <span className="px-1 font-bold">:</span>
