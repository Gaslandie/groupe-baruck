import type { ReactNode } from "react";

type ClientNoteProps = {
  children?: ReactNode;
};

export function ClientNote({ children = "À valider avec le client." }: ClientNoteProps) {
  return <small className="mt-[.4rem] block text-label italic leading-[1.5] text-[#8a8880]">{children}</small>;
}
