// Kept out of the "use client" theme module so the server layout can inline it.
export const THEME_KEY = "anglit-theme";

/** Runs before hydration so the saved theme never flashes. */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="ink"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;
