import { c as create_ssr_component } from "../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-14r5r5i_START -->${$$result.title = `<title>Tower of Hanoi Visualization</title>`, ""}<!-- HEAD_svelte-14r5r5i_END -->`, ""} ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
