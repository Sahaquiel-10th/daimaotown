import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

export function sitesStatic() {
  let root = process.cwd();
  return {
    name: "sites-static",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const dist = resolve(root, "dist");
      const client = resolve(dist, "client");
      await rm(client, { recursive: true, force: true });
      await mkdir(client, { recursive: true });

      for (const entry of ["index.html", "assets"]) {
        await cp(resolve(dist, entry), resolve(client, entry), { recursive: true });
      }

      await mkdir(resolve(dist, "server"), { recursive: true });
      await cp(resolve(root, "worker", "index.js"), resolve(dist, "server", "index.js"));
      await mkdir(resolve(dist, ".openai"), { recursive: true });
      await cp(resolve(root, ".openai", "hosting.json"), resolve(dist, ".openai", "hosting.json"));
    },
  };
}
