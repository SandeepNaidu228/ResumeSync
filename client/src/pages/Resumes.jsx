import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppSidebar from "../components/AppSidebar";
import ResumeToolbar from "../components/ResumeToolbar";
import ResumeCard from "../components/ResumeCard";

import {
  getResumes,
  createResume,
  deleteResume,
} from "../services/resumeService";

function Resumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadResumes = async () => {
    try {
      setError("");

      const data = await getResumes();

      setResumes(data.resumes || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleCreateResume = async () => {
    if (creating) return;

    try {
      setCreating(true);
      setError("");

      const data = await createResume();

      navigate(`/resumes/${data.resume._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteResume(resumeId);

      setResumes((current) =>
        current.filter((resume) => resume._id !== resumeId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="workspace-page">
      <AppSidebar />

      <main className="workspace-main">
        <header className="workspace-header">
          <div>
            <span className="workspace-eyebrow">
              WORKSPACE
            </span>

            <h1>Resumes</h1>

            <p>
              Create, manage and tailor your resumes.
            </p>
          </div>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={handleCreateResume}
            disabled={creating}
          >
            <span className="material-symbols-outlined">
              add
            </span>

            {creating ? "Creating..." : "Create Resume"}
          </button>
        </header>

        <div className="workspace-content">
          {error && (
            <div className="workspace-error">
              <span className="material-symbols-outlined">
                error
              </span>

              {error}
            </div>
          )}

          <div className="workspace-search-row">
            <div className="workspace-search">
              <span className="material-symbols-outlined">
                search
              </span>

              <input
                type="text"
                placeholder="Search resumes..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <ResumeToolbar />

          {loading ? (
            <div className="workspace-loading">
              <div className="workspace-spinner" />
              <p>Loading resumes...</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="resume-empty">
              <div className="resume-empty-icon">
                <span className="material-symbols-outlined">
                  description
                </span>
              </div>

              <h2>
                {search
                  ? "No resumes found"
                  : "Create your first resume"}
              </h2>

              <p>
                {search
                  ? "Try a different search."
                  : "Start with a blank resume and build it step by step."}
              </p>

              {!search && (
                <button
                  type="button"
                  className="workspace-primary-btn"
                  onClick={handleCreateResume}
                  disabled={creating}
                >
                  <span className="material-symbols-outlined">
                    add
                  </span>

                  Create Resume
                </button>
              )}
            </div>
          ) : (
            <section className="resume-grid">
              <ResumeCard
                isNew
                onOpen={handleCreateResume}
              />

              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onOpen={() =>
                    navigate(`/resumes/${resume._id}`)
                  }
                  onDelete={() =>
                    handleDeleteResume(resume._id)
                  }
                />
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Resumes;