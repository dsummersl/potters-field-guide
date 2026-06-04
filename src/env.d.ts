/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Base URL of the deployed Hello API. Injected by SST (linked from the Api
   *  construct); falls back to the local dev shim when unset. */
  readonly PUBLIC_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
