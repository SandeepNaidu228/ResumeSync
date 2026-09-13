const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    website: {
      type: websiteSchema,
      default: () => ({}),
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
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
    period: {
      type: String,
      default: "",
    },
    website: {
      type: websiteSchema,
      default: () => ({}),
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    school: {
      type: String,
      default: "",
    },
    degree: {
      type: String,
      default: "",
    },
    area: {
      type: String,
      default: "",
    },
    grade: {
      type: String,
      default: "",
    },
    period: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: websiteSchema,
      default: () => ({}),
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    period: {
      type: String,
      default: "",
    },
    website: {
      type: websiteSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const skillSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const languageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: "",
    },
    fluency: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
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
    website: {
      type: websiteSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const awardSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    awarder: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const genericItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    columns: {
      type: Number,
      default: 1,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Resume",
    },

    sectionOrder: {
        type: [String],
        default: [
            "basics",
            "summary",
            "profiles",
            "experience",
            "education",
            "skills",
            "projects",
            "languages",
            "certifications",
            "awards",
            "publications",
            "volunteer",
            "interests",
            "references",
        ],
    },

    basics: {
      name: {
        type: String,
        default: "",
      },
      headline: {
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
        type: websiteSchema,
        default: () => ({}),
      },
      customFields: {
        type: [genericItemSchema],
        default: [],
      },
    },

    summary: {
      title: {
        type: String,
        default: "Summary",
      },
      columns: {
        type: Number,
        default: 1,
      },
      hidden: {
        type: Boolean,
        default: false,
      },
      content: {
        type: String,
        default: "",
      },
    },

    sections: {
        profiles: {
            ...sectionSchema.obj,
            items: {
            type: [profileSchema],
            default: [],
            },
        },

        experience: {
            ...sectionSchema.obj,
            items: {
            type: [experienceSchema],
            default: [],
            },
        },

        education: {
            ...sectionSchema.obj,
            items: {
            type: [educationSchema],
            default: [],
            },
        },

        projects: {
            ...sectionSchema.obj,
            items: {
            type: [projectSchema],
            default: [],
            },
        },

        skills: {
            ...sectionSchema.obj,
            items: {
            type: [skillSchema],
            default: [],
            },
        },

        languages: {
            ...sectionSchema.obj,
            items: {
            type: [languageSchema],
            default: [],
            },
        },

        certifications: {
            ...sectionSchema.obj,
            items: {
            type: [certificationSchema],
            default: [],
            },
        },

        awards: {
            ...sectionSchema.obj,
            items: {
            type: [awardSchema],
            default: [],
            },
        },

        publications: {
            ...sectionSchema.obj,
            items: {
            type: [genericItemSchema],
            default: [],
            },
        },

        volunteer: {
            ...sectionSchema.obj,
            items: {
            type: [genericItemSchema],
            default: [],
            },
        },

        interests: {
            ...sectionSchema.obj,
            items: {
            type: [genericItemSchema],
            default: [],
            },
        },

        references: {
            ...sectionSchema.obj,
            items: {
            type: [genericItemSchema],
            default: [],
            },
        },
        },
    customSections: {
      type: [genericItemSchema],
      default: [],
    },

    metadata: {
      template: {
        type: String,
        default: "onyx",
      },

      primaryColor: {
        type: String,
        default: "#0ea841",
      },

      font: {
        type: String,
        default: "Inter",
      },

      spacing: {
        type: Number,
        default: 1,
      },

      layout: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      page: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      typography: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      css: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);