type FieldProps = {
  label: string;
  value: string | null;
};

export function Field(props: FieldProps) {
  const value = props.value ? props.value : "";

  return (
    <div className="space-x-2">
      <small className="text-sm font-medium capitalize md:text-base md:font-semibold">
        {props.label}:
      </small>
      <small className="text-sm font-medium capitalize md:text-base md:font-semibold">
        {value}
      </small>
    </div>
  );
}
