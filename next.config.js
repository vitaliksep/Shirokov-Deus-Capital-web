/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Перехватываем запрос к /yandex_8d56ecca5f15b2ac.html
        // и направляем его на наш API-роут — без редиректа, статус 200
        source: "/yandex_8d56ecca5f15b2ac.html",
        destination: "/api/yandex-verification",
      },
    ];
  },
};

module.exports = nextConfig;
