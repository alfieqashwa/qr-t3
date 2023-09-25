// format input to thousand separator
export function formattedInputPriceValue(input: string | number) {
  if (typeof input === "number") {
    return input
      .toString()
      .replace(/,/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return input.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formattedPrice = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
})
