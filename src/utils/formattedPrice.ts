// format input to thousand separator
export function formattedInputPriceValue(input: string | number) {
  if (typeof input === "number") {
    return input
      .toString()
      .replace(/,/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return input?.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") // [^0-9] <-- only disallow user to input non-numeric character.
}

export const formattedPrice = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
})
