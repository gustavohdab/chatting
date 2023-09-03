import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
  images: {
    domains: ['uploadthing.com', 'img.clerk.com'],
  },
}

module.exports = nextConfig
