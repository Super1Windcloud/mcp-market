const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const copyFile = (sourceRelative, targetRelative = sourceRelative) => {
  const source = path.join(rootDir, sourceRelative);
  const target = path.join(distDir, targetRelative);

  if (!fs.existsSync(source)) {
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
};

const copyDirectory = (sourceRelative, targetRelative = sourceRelative) => {
  const source = path.join(rootDir, sourceRelative);
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    return;
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourceChild = path.join(sourceRelative, entry.name);
    const targetChild = path.join(targetRelative, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourceChild, targetChild);
    } else if (entry.isFile()) {
      copyFile(sourceChild, targetChild);
    }
  }
};

const main = () => {
  fs.mkdirSync(distDir, { recursive: true });

  const filesToCopy = ["config.json", "netease_config.json", "playlists.json", "README.md", "package.json"];
  filesToCopy.forEach((file) => copyFile(file));

  copyDirectory("config");

  const serverEntry = path.join(distDir, "server.js");
  if (fs.existsSync(serverEntry)) {
    const shebang = "#!/usr/bin/env node\n";
    const original = fs.readFileSync(serverEntry, "utf8");
    if (!original.startsWith(shebang)) {
      fs.writeFileSync(serverEntry, shebang + original, "utf8");
    }
    try {
      fs.chmodSync(serverEntry, 0o755);
    } catch {
      // ignore on platforms that do not support chmod
    }
  }
};

main();
