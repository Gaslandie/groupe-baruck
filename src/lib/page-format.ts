/** Remplace uniquement les repères autorisés, dans du texte affiché par React. */
export function formatPageText(template: string, values: Record<string, string>): string {
  return template.replace(/\{([a-z]+)\}/g, (token, key: string) => Object.hasOwn(values, key) ? values[key] : token);
}
