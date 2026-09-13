function ResumeToolbar() {
  return (
    <div className="resume-toolbar">

      <div className="resume-toolbar-left">

        <button type="button" className="toolbar-select">
          <span>Last Updated</span>

          <span className="material-symbols-outlined">
            expand_more
          </span>
        </button>

        <button type="button" className="toolbar-select">
          <span>All Resumes</span>

          <span className="material-symbols-outlined">
            expand_more
          </span>
        </button>

      </div>

      <div className="resume-toolbar-right">

        <button
          type="button"
          className="toolbar-icon active"
          title="Grid view"
        >
          <span className="material-symbols-outlined">
            grid_view
          </span>
        </button>

        <button
          type="button"
          className="toolbar-icon"
          title="List view"
        >
          <span className="material-symbols-outlined">
            view_list
          </span>
        </button>

      </div>

    </div>
  );
}

export default ResumeToolbar;