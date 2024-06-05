// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    SITE_URL: string;
  }
}
