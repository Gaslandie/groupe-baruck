import {marked} from "marked";

export type EditorialKind = "article" | "product";
type RecordValue = Record<string, unknown>;
const object = (value: unknown): value is RecordValue => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const list = (value: unknown): RecordValue[] => Array.isArray(value) ? value as RecordValue[] : [];

/** Uniquement les textes. Les fichiers, routes, dates et identifiants restent partagés. */
export function englishProjection(source: RecordValue, kind: EditorialKind): RecordValue {
  const photo = (value: RecordValue, caption = true) => ({alt: value.alt ?? "", ...(caption ? {caption: value.caption ?? ""} : {})});
  if (kind === "product") return {name: source.name ?? "", images: list(source.images).map(value => photo(value, false))};
  return {
    title: source.title ?? "", excerpt: source.excerpt ?? "", body: source.body ?? "",
    coverAlt: source.coverAlt ?? source.cover_alt ?? "",
    gallery: list(source.gallery).map(value => photo(value)),
    groupsTitle: source.groupsTitle ?? "", groupsIntro: source.groupsIntro ?? "",
    groups: list(source.groups).map(group => ({label: group.label ?? "", note: group.note ?? "", photos: list(group.photos).map(value => photo(value))})),
  };
}

/** Contrat commun à l’import et au site ; aucun champ technique dans la traduction. */
export function validateEnglish(source: RecordValue, input: unknown, kind: EditorialKind): RecordValue {
  const visit = (original: unknown, value: unknown, key = ""): unknown => {
    const fail = (): never => { throw new Error(`Traduction anglaise invalide ou incomplète : ${key || kind}.`); };
    if (typeof original === "string") {
      const max = key === "body" ? 200000 : key === "excerpt" || key === "groupsIntro" ? 2000 : key === "name" ? 160 : key === "title" || key === "groupsTitle" ? 240 : 500;
      if (typeof value !== "string" || value.includes("\0") || Buffer.from(value).toString() !== value || Buffer.byteLength(value) > max || Boolean(original.trim()) !== Boolean(value.trim()) || (key !== "body" && /<\/?[a-z][^>]*>/iu.test(value))) fail();
      if (key === "body") marked.walkTokens(marked.lexer(value as string), token => {
        if (token.type === "html") fail();
        if (token.type === "link" && (/[\u0000-\u0020\\]/.test(token.href) || !(token.href.startsWith("/") && !token.href.startsWith("//")) && !/^(?:https?:\/\/|mailto:|tel:|#)/i.test(token.href))) fail();
        if (token.type === "image" && (!/^\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$/.test(token.href) || !token.text.trim())) fail();
      });
      return (value as string).trim();
    }
    if (Array.isArray(original)) {
      if (!Array.isArray(value) || value.length !== original.length) fail();
      return original.map((item, index) => visit(item, (value as unknown[])[index], key));
    }
    if (!object(original) || !object(value) || Object.keys(original).length !== Object.keys(value).length || Object.keys(value).some(name => !Object.hasOwn(original, name))) fail();
    return Object.fromEntries(Object.entries(original as RecordValue).map(([name, item]) => [name, visit(item, (value as RecordValue)[name], name)]));
  };
  return visit(englishProjection(source, kind), input) as RecordValue;
}

export function editorialEnglish(source: RecordValue, kind: EditorialKind): RecordValue | undefined {
  if (source.translations === undefined) return undefined;
  if (!object(source.translations) || Object.keys(source.translations).join() !== "en") throw new Error("Une seule traduction anglaise est attendue.");
  return validateEnglish(source, source.translations.en, kind);
}

/** Remplacer les seuls textes tout en conservant les sources des médias et les clés. */
export function applyEnglish(source: RecordValue, english: RecordValue): RecordValue {
  const merge = (original: unknown, translation: unknown): unknown => {
    if (typeof translation === "string") return translation;
    if (Array.isArray(translation)) return translation.map((item,index) => merge((original as unknown[])[index], item));
    return {...original as RecordValue, ...Object.fromEntries(Object.entries(translation as RecordValue).map(([key,value]) => [key,merge((original as RecordValue)?.[key],value)]))};
  };
  return merge(source,english) as RecordValue;
}
