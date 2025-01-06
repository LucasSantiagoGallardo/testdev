/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Modo estricto de React
  // Exportación estática habilitada
  images: {
    unoptimized: true, // Desactiva la optimización de imágenes para exportaciones estáticas
    domains: ["localhost"], // Dominios permitidos para cargar imágenes
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
      },
    ],
  },

}
export default nextConfig;
