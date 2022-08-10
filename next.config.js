const fs = require('fs')
const appConfig = JSON.parse(fs.readFileSync('/opt/runtime-config.json'))

console.log('loaded config for next.config.js:', appConfig)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: appConfig.server,
  publicRuntimeConfig: appConfig.public,
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
