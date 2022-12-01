import { defineConfig } from "astro/config";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://spuxx1701.github.io",
  base: "/fallout-resources",
  trailingSlash: "always",
  integrations: [mdx(), preact({ compat: true })],
});
