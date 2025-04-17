// For process.env type safety
export {};

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    HUGGINGFACE_API_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
