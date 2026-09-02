import mongoose from "mongoose";

const PersonalInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema({
  id: String,
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  current: {
    type: Boolean,
    default: false,
  },
  bullets: {
    type: [String],
    default: [],
  },
});

const EducationSchema = new mongoose.Schema({
  id: String,
  institution: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  field: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  gpa: {
    type: String,
    default: "",
  },
  bullets: {
    type: [String],
    default: [],
  },
});

const ProjectSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  technologies: {
    type: [String],
    default: [],
  },
  url: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  bullets: {
    type: [String],
    default: [],
  },
});

const SkillGroupSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
});

const CertificationSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    default: "",
  },
  issuer: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
});

const AchievementSchema = new mongoose.Schema({
  id: String,
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
});

const LanguageSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    default: "",
  },
  proficiency: {
    type: String,
    default: "",
  },
});

const CustomSectionSchema = new mongoose.Schema({
  id: String,
  title: {
    type: String,
    default: "",
  },
  items: {
    type: [String],
    default: [],
  },
});

const ResumeContentSchema = new mongoose.Schema(
  {
    personal: {
      type: PersonalInfoSchema,
      default: () => ({}),
    },

    summary: {
      type: String,
      default: "",
    },

    experience: {
      type: [ExperienceSchema],
      default: [],
    },

    education: {
      type: [EducationSchema],
      default: [],
    },

    projects: {
      type: [ProjectSchema],
      default: [],
    },

    skills: {
      type: [SkillGroupSchema],
      default: [],
    },

    certifications: {
      type: [CertificationSchema],
      default: [],
    },

    achievements: {
      type: [AchievementSchema],
      default: [],
    },

    languages: {
      type: [LanguageSchema],
      default: [],
    },

    customSections: {
      type: [CustomSectionSchema],
      default: [],
    },
  },
  { _id: false }
);

const ResumeDesignSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      default: "modern",
    },

    fontFamily: {
      type: String,
      default: "Inter",
    },

    fontSize: {
      type: Number,
      default: 10,
    },

    headingSize: {
      type: Number,
      default: 14,
    },

    lineHeight: {
      type: Number,
      default: 1.2,
    },

    accentColor: {
      type: String,
      default: "#2563eb",
    },

    sectionSpacing: {
      type: Number,
      default: 12,
    },

    pageMargin: {
      type: Number,
      default: 36,
    },
  },
  { _id: false }
);

const ResumeSectionSchema = new mongoose.Schema(
  {
    id: String,

    type: {
      type: String,
      enum: [
        "personal",
        "summary",
        "experience",
        "education",
        "projects",
        "skills",
        "certifications",
        "achievements",
        "languages",
        "custom",
      ],
    },

    title: String,

    visible: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      default: "Untitled Resume",
      trim: true,
    },

    content: {
      type: ResumeContentSchema,
      default: () => ({}),
    },

    design: {
      type: ResumeDesignSchema,
      default: () => ({}),
    },

    builderConfig: {
      sections: {
        type: [ResumeSectionSchema],
        default: [],
      },
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", ResumeSchema);