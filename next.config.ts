module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.dev.pragma.build/node/v1/data/:path*/usd',
      },
    ]
  },
}