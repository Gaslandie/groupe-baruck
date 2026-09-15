import fs from "node:fs";
import path from "node:path";

/**
 * Vrai si le fichier existe dans `public/` au moment du build.
 * Sert aux médias lourds (vidéos) déposés à part : la section disparaît
 * tant que le fichier n'est pas là, au lieu d'afficher un lecteur vide.
 */
export function publicFileExists(src: `/${string}`): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", src.slice(1)));
}
