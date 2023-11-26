import PhoneInput from "react-phone-number-input"
import { cn } from "../utils"

type FlagPhoneInputProps = {
  value?: string | undefined
  // onChange(value?: E164Number | undefined): void
  onChange(value?: string | undefined): void
  className?: string
}

export function FlagPhoneInput({
  value,
  onChange,
  className,
}: FlagPhoneInputProps) {
  return (
    <PhoneInput
      defaultCountry="ID"
      value={value} //! [^0-9+] <-- only allowed user to type numeric-characters and '+' symbol
      onChange={onChange}
      className={cn(
        "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  )
}
