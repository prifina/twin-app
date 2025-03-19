import createMDX from '@next/mdx'

//const path = require('path');
/* 
module.exports = {
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@': path.resolve(__dirname, '/src'),
  //     // Add more aliases as needed
  //   };
  //   return config;
  // },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    MY_REGION: process.env.MY_REGION,
    NEXT_PUBLIC_APP_ID: process.env.APP_ID,
    MIDDLEWARE_API_URL: process.env.MIDDLEWARE_API_URL,
    SPEAK_TO_WEB: process.env.SPEAK_TO_WEB,
    SPEAK_TO_CDN: process.env.SPEAK_TO_CDN,
    NEXT_PUBLIC_APP_DEV: process.env.NEXT_PUBLIC_APP_DEV,
    NEXT_PUBLIC_APP_DEBUG: process.env.NEXT_PUBLIC_APP_DEBUG,
    JWT_SECRET_BASE64: process.env.JWT_SECRET_BASE64,
    CORE_API_URL: process.env.CORE_API_URL,
    CORE_API_KEY: process.env.CORE_API_KEY,
  }
} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    MY_REGION: process.env.MY_REGION,
    NEXT_PUBLIC_APP_ID: process.env.APP_ID,
    MIDDLEWARE_API_URL: process.env.MIDDLEWARE_API_URL,
    SPEAK_TO_WEB: process.env.SPEAK_TO_WEB,
    SPEAK_TO_CDN: process.env.SPEAK_TO_CDN,
    NEXT_PUBLIC_APP_DEV: process.env.NEXT_PUBLIC_APP_DEV,
    NEXT_PUBLIC_APP_DEBUG: process.env.NEXT_PUBLIC_APP_DEBUG,
    JWT_SECRET_BASE64: process.env.JWT_SECRET_BASE64,
    CORE_API_URL: process.env.CORE_API_URL,
    CORE_API_KEY: process.env.CORE_API_KEY,
    NEXT_PUBLIC_NETWORKK_ID: process.env.NEXT_PUBLIC_NETWORK_ID,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}


const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

//export default nextConfig;
export default withMDX(nextConfig);