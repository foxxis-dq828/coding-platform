/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LABEL_STUDIO_URL?: string;
  readonly VITE_LABEL_STUDIO_TOKEN?: string;
  readonly VITE_LABEL_STUDIO_REFRESH_TOKEN?: string;
  readonly VITE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
