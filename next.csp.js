const { createSecureHeaders } = require('next-secure-headers')
const { PHASE_PRODUCTION_BUILD } = require('next/constants')

const TLSHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains'
  }
]

const formatUrl = (url) =>
  url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `https://${url}`

const commonHeaders = [
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(self), camera=(self)'
  },
  { key: 'Cache-Control', value: 'no-cache,no-store' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
  { key: 'X-Content-Type-Options', value: 'no-sniff' },

  { key: 'Referrer-Policy', value: 'same-origin' },
  ...createSecureHeaders({
    contentSecurityPolicy: {
      directives: {
        // defaultSrc: "'self'",
        // imgSrc: ["'self'", 'data:'],
        // workerSrc: ["'self'", 'blob:'],
        // childSrc: ["'self'", 'blob:'],
        // styleSrc: [
        //   "'self'",
        //   "'unsafe-inline'",
        //   'https://fonts.googleapis.com',
        //   'https://fonts.gstatic.com',
        //   'https://api.tiles.mapbox.com'
        // ],
        // fontSrc: [
        //   "'self'",
        //   'https://fonts.googleapis.com',
        //   'https://fonts.gstatic.com'
        // ],
        // scriptSrc: ["'self'", "'unsafe-eval'", 'https://*.mapbox.com'],
        connectSrc: [
          "'self'",
          ...(process.env.BASE_URL ? [process.env.BASE_URL] : []),
          ...(process.env.VERCEL_URL ? [formatUrl(process.env.VERCEL_URL)] : [])
        ]
      }
    }
  })
]

module.exports = {
  createCSPHeaders(phase) {
    return phase !== PHASE_PRODUCTION_BUILD
      ? [{ source: '/(.*)', headers: commonHeaders }]
      : [{ source: '/(.*)', headers: [...TLSHeaders, ...commonHeaders] }]
  }
}
