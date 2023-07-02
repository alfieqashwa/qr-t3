type FieldProps = {
  label: string
  value: string | null
}

export function Field(props: FieldProps) {
  const value = props.value ? props.value : ""

  return (
    <div className="space-x-2">
      <small className="text-sm font-medium capitalize lg:text-base lg:font-semibold">
        {props.label}:
      </small>
      <small className="text-sm font-medium capitalize lg:text-base lg:font-semibold">
        {value}
      </small>
    </div>
  )
}
