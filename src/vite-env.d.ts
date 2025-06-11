/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_PAGEFIND?: string;
    // add other env variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }