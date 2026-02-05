import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    tailwindcssAnimate,
    function ({ addUtilities, theme }) {
      const opacityUtilities = {};
      const opacityValues = theme("opacity");

      Object.keys(opacityValues).forEach((opacity) => {
        opacityUtilities[`.bg-opacity-${opacity}`] = {
          "--tw-bg-opacity": opacityValues[opacity],
        };
        opacityUtilities[`.text-opacity-${opacity}`] = {
          "--tw-text-opacity": opacityValues[opacity],
        };
        opacityUtilities[`.border-opacity-${opacity}`] = {
          "--tw-border-opacity": opacityValues[opacity],
        };
      });

      addUtilities(opacityUtilities);
    },
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
    },
  },
};
