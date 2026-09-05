type StructuredDataProps = {
  data: unknown;
};

/** Bloc JSON-LD rendu au build (aucun JavaScript client). */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
