import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableSection({
  section,
  isActive,
  onClick,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      className={`builder-section-link ${
        isActive ? "active" : ""
      }`}
      onClick={onClick}
      {...attributes}
    >
      <span
        className="material-symbols-outlined section-drag-handle"
        {...listeners}
        title="Drag to reorder"
        onClick={(event) => event.stopPropagation()}
      >
        drag_indicator
      </span>

      <span className="material-symbols-outlined section-icon">
        {section.icon}
      </span>

      <span className="section-label">
        {section.label}
      </span>
    </button>
  );
}

export default SortableSection;