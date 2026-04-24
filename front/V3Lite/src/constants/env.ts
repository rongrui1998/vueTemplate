export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  title: import.meta.env.VITE_APP_TITLE || 'V3 Lite Admin',
  subtitle: import.meta.env.VITE_APP_SUBTITLE || 'Vue Admin Template',
  useMock: import.meta.env.VITE_APP_USE_MOCK !== 'false',
}
