declare module 'convict-format-with-validator' {
  import type { Format } from 'convict';

  const formats: Record<'email' | 'ipaddress' | 'url', Format>;

  export default formats;
}
