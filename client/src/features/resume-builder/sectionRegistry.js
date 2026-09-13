export const SECTION_DEFINITIONS = [
  {
    id: "basics",
    label: "Basics",
    icon: "person",
    required: true,
  },
  {
    id: "summary",
    label: "Summary",
    icon: "notes",
  },
  {
    id: "profiles",
    label: "Profiles",
    icon: "link",
  },
  {
    id: "experience",
    label: "Experience",
    icon: "work",
  },
  {
    id: "education",
    label: "Education",
    icon: "school",
  },
  {
    id: "skills",
    label: "Skills",
    icon: "psychology",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "folder",
  },
  {
    id: "languages",
    label: "Languages",
    icon: "translate",
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: "workspace_premium",
  },
  {
    id: "awards",
    label: "Awards",
    icon: "emoji_events",
  },
  {
    id: "publications",
    label: "Publications",
    icon: "article",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    icon: "volunteer_activism",
  },
  {
    id: "interests",
    label: "Interests",
    icon: "interests",
  },
  {
    id: "references",
    label: "References",
    icon: "groups",
  },
];

export const DEFAULT_SECTION_ORDER =
  SECTION_DEFINITIONS.map((section) => section.id);

export const getSectionDefinition = (id) =>
  SECTION_DEFINITIONS.find(
    (section) => section.id === id
  );