import { useCallback, useState, type FunctionComponent } from "react"
import { Cell, Pie, PieChart, Sector, type SectorProps } from "recharts"
import { type PieSectorDataItem } from "recharts/types/polar/Pie"
import { type ActiveShape } from "recharts/types/util/types"

export interface DataItem {
  color: string
  name: string
  value: number
}

interface RenderActiveShapeProps extends SectorProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: DataItem
  percent: number
  value: number
}

const renderActiveShape: FunctionComponent<RenderActiveShapeProps> = (
  props,
) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        // fill="#666"
        className="fill-amber-300 text-sm"
      >{`Qty ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  )
}

type PieChartActiveShapeProps = { data: DataItem[] }
export default function PieChartActiveShape(props: PieChartActiveShapeProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const onPieEnter = useCallback(
    (_: unknown, index: number) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  return (
    <PieChart width={400} height={400} className="mx-auto">
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
        data={props.data}
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
        className="font-semibold"
      >
        {props.data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  )
}
