/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_NODE_ENV: string
  readonly VITE_SYNC_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
