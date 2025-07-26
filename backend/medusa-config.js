// my-medusa-store/medusa-config.js
// JS shim so Medusa’s CLI sees your custom admin.outDir
const path = require("path")
const tsConfig = require("./medusa-config.ts").default

module.exports = {
  ...tsConfig,
  admin: {
    outDir: path.join(__dirname, "public", "admin"),
    ...(tsConfig.admin || {}),
  },
}
