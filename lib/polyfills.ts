// Polyfills for browser APIs to prevent SSR errors
if (typeof window === 'undefined') {
  // Server-side polyfills
  global.indexedDB = undefined as any
  global.localStorage = undefined as any
  global.sessionStorage = undefined as any
  global.navigator = {
    userAgent: 'node.js',
  } as any
  global.window = undefined as any
  global.document = undefined as any
}
