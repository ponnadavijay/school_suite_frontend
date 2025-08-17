interface ImportMetaEnv {
  [x: string]: any;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

