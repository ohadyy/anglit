// Kept out of the "use client" theme module so the server layout can inline it.
export const THEME_KEY = "anglit-theme";

/** Runs before hydration so the saved theme never flashes. */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="ink"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export const INTRO_SEEN_KEY = "anglit-intro-seen";

/** Marks <html> before paint when this tab already saw the home intro, so CSS can hide it with no flash. */
export const introScript = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")==="1")document.documentElement.dataset.introSeen="1"}catch(e){}`;
