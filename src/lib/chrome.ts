// Which pages get which parts of the site chrome, and which are kept out of search.
// Matching is by prefix, so sub-pages like /admin/crm follow their section.

const inSection = (path: string, section: string) => path === section || path.startsWith(`${section}/`);
const inAny = (path: string, sections: readonly string[]) => sections.some((s) => inSection(path, s));

/** Internal tools and the calm area: no site header, footer or tab bar */
const OWN_CHROME = ["/studio", "/review", "/lab", "/admin", "/journal", "/calm"];

// Practice and exam sessions have their own bottom bar or a timer, the campaign landing pages and pricing
// are for people without an account yet (one call to action), and the sign-in / sign-up / checkout forms
// need full attention.
const NO_TAB_BAR = ["/practice", "/exam", "/ads", "/pricing", "/sign-in", "/sign-up", "/checkout", "/start"];

/** Disallowed in robots.txt: tools and account flows (each also carries its own noindex) */
export const NOINDEX_PATHS = ["/studio", "/review", "/lab", "/admin", "/journal", "/account", "/sign-in", "/sign-up", "/checkout"];

export const isOwnChrome = (path: string) => inAny(path, OWN_CHROME);

/** Paid-traffic landing page: nothing in the header may lead away from it */
export const isFocusedPage = (path: string) => path === "/ads";

/** The homepage is its own full-bleed hero with its own CTAs, and the tab bar has no room to sit well there */
export const hasTabBar = (path: string) => path !== "/" && !inAny(path, NO_TAB_BAR);

/** The WhatsApp button shows on the homepage and wherever the tab bar does */
export const hasFab = (path: string) => path === "/" || hasTabBar(path);

/** The homepage hero runs under the header; every other page starts below it */
export const isFullBleed = (path: string) => path === "/";
