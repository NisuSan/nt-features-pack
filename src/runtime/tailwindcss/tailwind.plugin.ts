import plugin from 'tailwindcss/plugin.js';

module.exports = plugin.withOptions((options) => ({ }) => {}, (options: { colors: Record<string, string> }) => ({
  theme: {
    extend: {
      colors: options.colors
    }
  }
}))
