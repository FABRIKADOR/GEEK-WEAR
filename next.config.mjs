/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ufmscjskhxvzybfpfknr.supabase.co'], // Add your Supabase domain for image storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Desactivar optimización de imágenes
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la compilación
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante la compilación
  },
  // Asegurar que no hay middleware
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
