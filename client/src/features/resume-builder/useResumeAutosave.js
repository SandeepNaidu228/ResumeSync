import { useEffect, useRef } from "react";
import { updateResume } from "../../services/resumeService";

function useResumeAutosave(
  resume,
  enabled = true,
  delay = 1200
) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (!enabled || !resume?._id) {
      return;
    }

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        await updateResume(
          resume._id,
          resume
        );
      } catch (error) {
        console.error(
          "Autosave failed:",
          error
        );
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [resume, enabled, delay]);
}

export default useResumeAutosave;