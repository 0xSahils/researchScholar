import { Atom, BookOpenText, Brain, Buildings, Flask, Gavel, Leaf, Lightning, Stethoscope, Student, Wrench } from "@phosphor-icons/react/dist/ssr";

const iconMap = [
  Wrench,
  Brain,
  Buildings,
  Stethoscope,
  Flask,
  Atom,
  Lightning,
  BookOpenText,
  Gavel,
  Buildings,
  Student,
  Leaf,
];

export function SubjectChipGrid({ fields }: { fields: string[] }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {fields.map((field, index) => {
        const Icon = iconMap[index % iconMap.length];
        return (
          <span
            key={field}
            className="inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-brand-light/40 px-4 py-2 text-xs font-semibold text-brand-deep"
          >
            {/* TODO: replace with subject-specific Phosphor icon */}
            <Icon className="h-4 w-4" />
            {field}
          </span>
        );
      })}
    </div>
  );
}
