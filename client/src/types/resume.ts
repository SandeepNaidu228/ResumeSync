// client/src/types/resume.ts

// ============================================================
// Personal Information
// ============================================================

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;

  website?: string;
  linkedin?: string;
  github?: string;
}


// ============================================================
// Professional Experience
// ============================================================

export interface Experience {
  id: string;

  company: string;
  position: string;
  location?: string;

  startDate: string;
  endDate?: string;
  current: boolean;

  bullets: string[];
}


// ============================================================
// Education
// ============================================================

export interface Education {
  id: string;

  institution: string;
  degree: string;
  field?: string;
  location?: string;

  startDate?: string;
  endDate?: string;

  gpa?: string;

  bullets?: string[];
}


// ============================================================
// Projects
// ============================================================

export interface Project {
  id: string;

  name: string;

  description: string;

  technologies: string[];

  url?: string;
  github?: string;

  bullets?: string[];
}


// ============================================================
// Skills
// ============================================================

export interface SkillGroup {
  id: string;

  /**
   * Examples:
   * "Programming Languages"
   * "Frameworks"
   * "Databases"
   * "Tools"
   */
  name: string;

  skills: string[];
}


// ============================================================
// Certifications
// ============================================================

export interface Certification {
  id: string;

  name: string;

  issuer?: string;

  date?: string;

  url?: string;
}


// ============================================================
// Achievements
// ============================================================

export interface Achievement {
  id: string;

  title: string;

  description?: string;

  date?: string;
}


// ============================================================
// Languages
// ============================================================

export interface Language {
  id: string;

  name: string;

  /**
   * Examples:
   * "Native"
   * "Fluent"
   * "Professional"
   * "Intermediate"
   * "Basic"
   */
  proficiency?: string;
}


// ============================================================
// Custom Sections
// ============================================================

export interface CustomSection {
  id: string;

  title: string;

  items: string[];
}


// ============================================================
// Resume Content
// ============================================================

/**
 * This represents the actual information contained
 * inside a resume.
 *
 * It does NOT contain visual/design information.
 */
export interface ResumeData {
  personal: PersonalInfo;

  summary: string;

  experience: Experience[];

  education: Education[];

  projects: Project[];

  skills: SkillGroup[];

  certifications: Certification[];

  achievements: Achievement[];

  languages: Language[];

  customSections: CustomSection[];
}


// ============================================================
// Resume Design
// ============================================================

/**
 * Controls how ResumeData is rendered.
 *
 * The same ResumeData can be rendered using
 * different templates/designs.
 */
export interface ResumeDesign {
  /**
   * Template identifier.
   *
   * Examples:
   * "modern"
   * "classic"
   * "minimal"
   */
  templateId: string;

  fontFamily: string;

  fontSize: number;

  headingSize: number;

  lineHeight: number;

  accentColor: string;

  sectionSpacing: number;

  pageMargin: number;
}


// ============================================================
// Resume Document
// ============================================================

/**
 * Complete resume stored by ResumeSync.
 *
 * This is the object that will eventually correspond
 * to our MongoDB Resume model.
 */
export interface ResumeDocument {
  id: string;

  userId: string;

  name: string;

  /**
   * Actual resume information.
   */
  content: ResumeData;

  /**
   * Visual configuration.
   */
  design: ResumeDesign;

  /**
   * Current version number.
   */
  version: number;

  createdAt?: string;

  updatedAt?: string;
}


// ============================================================
// Default Resume Data
// ============================================================

/**
 * Creates a completely empty resume.
 *
 * Used when:
 * - Creating a resume from scratch
 * - Starting a new resume
 * - Resetting a resume
 */
export const createEmptyResume = (): ResumeData => ({
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },

  summary: "",

  experience: [],

  education: [],

  projects: [],

  skills: [],

  certifications: [],

  achievements: [],

  languages: [],

  customSections: [],
});


// ============================================================
// Default Resume Design
// ============================================================

export const defaultResumeDesign: ResumeDesign = {
  templateId: "modern",

  fontFamily: "Inter",

  fontSize: 10,

  headingSize: 14,

  lineHeight: 1.2,

  accentColor: "#2563eb",

  sectionSpacing: 12,

  pageMargin: 36,
};


// ============================================================
// Resume Section Types
// ============================================================

/**
 * Used by the builder to identify resume sections.
 */
export type ResumeSectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "languages"
  | "custom";


// ============================================================
// Resume Section Metadata
// ============================================================

/**
 * Used by the Resume Builder sidebar.
 *
 * Example:
 *
 * {
 *   type: "experience",
 *   title: "Experience",
 *   visible: true
 * }
 */
export interface ResumeSection {
  id: string;

  type: ResumeSectionType;

  title: string;

  visible: boolean;

  order: number;
}


// ============================================================
// Resume Builder Configuration
// ============================================================

/**
 * Controls the order and visibility of sections
 * in the resume builder/template.
 */
export interface ResumeBuilderConfig {
  sections: ResumeSection[];
}


// ============================================================
// Complete Resume
// ============================================================

/**
 * Extended resume document used by the builder.
 *
 * This allows us to keep:
 *
 * Resume content
 * + Design
 * + Section configuration
 * + Version
 */
export interface ResumeDocumentWithConfig extends ResumeDocument {
  builderConfig: ResumeBuilderConfig;
}


// ============================================================
// Default Builder Configuration
// ============================================================

export const defaultResumeSections: ResumeSection[] = [
  {
    id: "personal",
    type: "personal",
    title: "Personal Information",
    visible: true,
    order: 0,
  },

  {
    id: "summary",
    type: "summary",
    title: "Professional Summary",
    visible: true,
    order: 1,
  },

  {
    id: "experience",
    type: "experience",
    title: "Experience",
    visible: true,
    order: 2,
  },

  {
    id: "education",
    type: "education",
    title: "Education",
    visible: true,
    order: 3,
  },

  {
    id: "projects",
    type: "projects",
    title: "Projects",
    visible: true,
    order: 4,
  },

  {
    id: "skills",
    type: "skills",
    title: "Skills",
    visible: true,
    order: 5,
  },

  {
    id: "certifications",
    type: "certifications",
    title: "Certifications",
    visible: true,
    order: 6,
  },

  {
    id: "achievements",
    type: "achievements",
    title: "Achievements",
    visible: true,
    order: 7,
  },

  {
    id: "languages",
    type: "languages",
    title: "Languages",
    visible: true,
    order: 8,
  },

  {
    id: "custom",
    type: "custom",
    title: "Custom Sections",
    visible: true,
    order: 9,
  },
];


// ============================================================
// Default Builder Configuration
// ============================================================

export const defaultResumeBuilderConfig: ResumeBuilderConfig = {
  sections: defaultResumeSections,
};


// ============================================================
// Create New Resume
// ============================================================

/**
 * Creates a complete new resume object on the client.
 *
 * Backend will eventually generate the permanent ID.
 */
export const createEmptyResumeDocument = (
  userId: string,
  name = "Untitled Resume"
): ResumeDocumentWithConfig => ({
  id: "",
  userId,

  name,

  content: createEmptyResume(),

  design: {
    ...defaultResumeDesign,
  },

  version: 1,

  builderConfig: {
    sections: defaultResumeSections.map((section) => ({
      ...section,
    })),
  },
});