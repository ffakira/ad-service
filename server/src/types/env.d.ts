declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: string | number;
      COOKIE_SECRET: string;
      MONGO_URI: string;
      API_KEY: string;
    }
  }
}

export {};
