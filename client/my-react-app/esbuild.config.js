import esbuild from "esbuild";
esbuild
  .build({
    entryPoints: ["src/main.jsx"],
    bundle: true,
    outfile: "dist/bundle.js",
    loader: { ".js": "jsx" },
  })
  .catch((error) => {
    console.error(error);
    return;
  });
