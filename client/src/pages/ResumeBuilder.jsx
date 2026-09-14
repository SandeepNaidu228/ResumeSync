import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import BuilderHeader from "../components/builder/BuilderHeader";
import SectionSidebar from "../components/builder/SectionSidebar";
import ResumeEditor from "../components/builder/ResumeEditor";
import ResumePreview from "../components/builder/ResumePreview";
import useResumeAutosave from "../features/resume-builder/useResumeAutosave";

import {
  getResumeById,
  updateResume,
} from "../services/resumeService";

import {
  DEFAULT_SECTION_ORDER,
} from "../features/resume-builder/sectionRegistry";

function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [activeSection, setActiveSection] =
    useState("basics");

  const [sectionOrder, setSectionOrder] =
    useState(DEFAULT_SECTION_ORDER);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useResumeAutosave(resume, Boolean(resume));

  useEffect(() => {
    const loadResume = async () => {
      try {
        setError("");

        const data = await getResumeById(id);

        const loadedResume = data.resume;

        setResume(loadedResume);

        setSectionOrder(
          loadedResume.sectionOrder?.length
            ? loadedResume.sectionOrder
            : DEFAULT_SECTION_ORDER
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id]);

  const handleResumeChange = (updates) => {
    setResume((current) => ({
      ...current,
      ...updates,
    }));
  };

  const handleSectionOrderChange = (order) => {
    setSectionOrder(order);

    setResume((current) => ({
      ...current,
      sectionOrder: order,
    }));
  };

  const handleSave = async () => {
    if (!resume || saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await updateResume(
        id,
        {
          ...resume,
          sectionOrder,
        }
      );

      setResume(data.resume);

      setSectionOrder(
        data.resume.sectionOrder?.length
          ? data.resume.sectionOrder
          : sectionOrder
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="builder-loading">
        <div className="workspace-spinner" />
        <p>Loading resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="builder-error">
        <div>
          <h2>Resume not found</h2>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={() => navigate("/resumes")}
          >
            Back to Resumes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-page">

      <BuilderHeader
        resume={resume}
        saving={saving}
        onSave={handleSave}
        onBack={() => navigate("/resumes")}
      />

      <div className="builder-body">

        <SectionSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sectionOrder={sectionOrder}
          onSectionOrderChange={
            handleSectionOrderChange
          }
        />

        <ResumeEditor
          resume={resume}
          activeSection={activeSection}
          onChange={handleResumeChange}
        />

        <ResumePreview
          resume={resume}
        />

      </div>

    </div>
  );
}

export default ResumeBuilder;