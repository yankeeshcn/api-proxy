// server/utils/proxy.ts

export const proxyTargets = (() => {
  const env = process.env;
  const targets = [];

  for (const key in env) {
    if (key.startsWith("PROXY_") && key.endsWith("_TARGET")) {
      const path = `/${key
        .replace("PROXY_", "")
        .replace("_TARGET", "")
        .toLowerCase()}`;
      const target = env[key];
      if (target) {
        targets.push({ path, target });
      }
    }
  }

  return targets;
})();
