interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_BACKEND_URL: string
  readonly VITE_APP_TITLE: string
}

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}
