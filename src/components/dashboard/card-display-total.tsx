import { Card, CardTitle } from "~/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/ui/tooltip"

type CardDisplayTotalProps = {
  total: number
  tooltipMessage: string
  icon: JSX.Element
}

export const CardDisplayTotal = ({
  total,
  tooltipMessage,
  icon,
}: CardDisplayTotalProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Card className="flex w-auto items-center justify-center space-x-3 p-3 md:space-x-4 md:p-4">
          <CardTitle>{icon}</CardTitle>
          <CardTitle className="text-lg text-amber-300 md:text-2xl">
            {total}
          </CardTitle>
        </Card>
      </TooltipTrigger>
      <TooltipContent className="capitalize">{tooltipMessage}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
