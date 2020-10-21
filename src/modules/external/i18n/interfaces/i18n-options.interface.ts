export interface I18nOptions {
  defaultLocale: string;
  directory?: string;
  fallbacks: { [index: string]: string };
}
