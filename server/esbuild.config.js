import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/server.js"],
    bundle: true,
    outfile: "dist/bundle.js",
    loader: { ".js": "jsx" },
  })
  .catch(() => process.exit(1));
