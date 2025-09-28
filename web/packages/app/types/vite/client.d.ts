declare module "vite/client" {
  export interface ImportMetaEnv {
    readonly [key: string]: string | undefined;
  }

  export interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

declare const importMetaEnv: Record<string, string | undefined>;

declare interface ImportMetaEnv {
  readonly [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
