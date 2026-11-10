import { STORAGE_KEYS } from "./storageKeys";

// Kept out of the "use client" theme module so the server layout can inline it.

/** Root font sizes of the accessibility panel's text-size steps */
export const A11Y_SIZES = ["100%", "112%", "125%"];

/** Runs before hydration so the saved theme and accessibility choices never flash. */
export const themeScript =
  `try{var t=localStorage.getItem("${STORAGE_KEYS.theme}");if(t==="ink"||t==="light")document.documentElement.dataset.theme=t}catch(e){}` +
  // Same effect as applyPrefs in components/AccessibilityWidget.tsx
  `try{var a=JSON.parse(localStorage.getItem("${STORAGE_KEYS.accessibility}")||"null");if(a){var r=document.documentElement,z=${JSON.stringify(A11Y_SIZES)}[a.size];if(z)r.style.fontSize=z;r.classList.toggle("a11y-contrast",!!a.contrast);r.classList.toggle("a11y-links",!!a.links);r.toggleAttribute("data-still",!!a.still)}}catch(e){}`;

/** Marks <html> before paint when this tab already saw the home intro, so CSS can hide it with no flash. */
export const introScript = `try{if(sessionStorage.getItem("${STORAGE_KEYS.introSeen}")==="1")document.documentElement.dataset.introSeen="1"}catch(e){}`;
