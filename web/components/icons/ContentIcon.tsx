"use client";

import {
  Article,
  Books,
  Certificate,
  FileText,
  GraduationCap,
  Microscope,
  Scroll,
  SealCheck,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";

import type { ContentIconKey } from "@/lib/types/content-icon";

const MAP = {
  article: Article,
  books: Books,
  certificate: Certificate,
  fileText: FileText,
  graduationCap: GraduationCap,
  microscope: Microscope,
  scroll: Scroll,
  sealCheck: SealCheck,
} as const;

type ContentIconProps = {
  name: ContentIconKey;
} & IconProps;

export function ContentIcon({ name, ...rest }: ContentIconProps) {
  const Cmp = MAP[name];
  return <Cmp {...rest} />;
}
