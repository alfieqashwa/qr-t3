/* auto-closed after succeed submit the dialog form */

export function wait(duration = 1000) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}