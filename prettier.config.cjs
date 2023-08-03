/** @type {import("prettier").Config} */
module.exports = {
  tailwindFunctions: ["clsx"],
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
}
