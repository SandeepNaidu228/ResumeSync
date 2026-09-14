import ClassicATS from "./ClassicATS";

export const TEMPLATE_REGISTRY = {
  classic: {
    id: "classic",
    name: "Classic ATS",
    description:
      "A compact, professional single-column resume based on the classic LaTeX layout.",
    component: ClassicATS,
  },
};

export const DEFAULT_TEMPLATE = "classic";

export function getTemplate(templateId) {
  return (
    TEMPLATE_REGISTRY[templateId] ||
    TEMPLATE_REGISTRY[DEFAULT_TEMPLATE]
  );
}