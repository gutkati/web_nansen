import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  env: {
    // Переменные с NEXT_PUBLIC_* будут заменяться на этапе сборки
    NEXT_PUBLIC_IS_BUILD_TIME: process.env.NEXT_PUBLIC_IS_BUILD_TIME || 'false',
  },
};
export default nextConfig;
