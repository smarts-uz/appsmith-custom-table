type Translations = Record<string, string> | undefined;
type Replacements = Record<string, string>;

export const getT =
  (translations: Translations, defaultTranslations: Translations) =>
  <K extends keyof typeof defaultTranslations>(
    key: K,
    replacements: Replacements = {}
  ): string => {
    const template =
      (translations && translations[key as string]) ??
      (defaultTranslations && defaultTranslations[key as string]);

    if (!template) {
      return String(key);
    }
    return Object.entries(replacements).reduce(
      (acc, [placeholder, value]) =>
        acc.replace(new RegExp(`{${placeholder}}`, "g"), String(value)),
      template
    );
  };
