/** @type {import('tailwindcss').Config} */
module.exports = {
  // Narrow the scanned paths to avoid matching node_modules and improve build perf.
  // No prefix so standard Tailwind utility class names are generated (e.g. `bg-white`, `container`).
  // Scan all HTML and JS files so Tailwind detects all utility classes used across the repo.
  content: [
    "./**/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  // Ensure commonly used classes are always included so we don't accidentally miss them during the build.
  safelist: [
    'bg-white','bg-green-700','bg-green-600','text-white','text-gray-800','text-gray-700','container',
    'text-3xl','text-2xl','text-xl','text-sm','font-bold','font-semibold','hidden','block','md:flex','md:hidden',
    'px-4','py-4','px-6','py-6','mt-4','mb-4','mx-auto','rounded','shadow','shadow-md','flex','items-center','justify-between'
  ],
  plugins: [],
}
