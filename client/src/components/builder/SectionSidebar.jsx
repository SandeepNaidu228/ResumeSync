

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableSection from "./SortableSection";

import {
  SECTION_DEFINITIONS,
  getSectionDefinition,
} from "../../features/resume-builder/sectionRegistry";

function SectionSidebar({
  activeSection,
  onSectionChange,
  sectionOrder,
  onSectionOrderChange,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const orderedSections = sectionOrder
    .map(getSectionDefinition)
    .filter(Boolean);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sectionOrder.indexOf(
      active.id
    );

    const newIndex = sectionOrder.indexOf(
      over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onSectionOrderChange(
      arrayMove(
        sectionOrder,
        oldIndex,
        newIndex
      )
    );
  };

  const addSection = (sectionId) => {
    if (sectionOrder.includes(sectionId)) {
      return;
    }

    onSectionOrderChange([
      ...sectionOrder,
      sectionId,
    ]);
  };

  const availableSections =
    SECTION_DEFINITIONS.filter(
      (section) =>
        !sectionOrder.includes(section.id) &&
        section.id !== "basics"
    );

  return (
    <aside className="builder-sidebar">

      <div className="builder-sidebar-heading">
        <span>Resume Sections</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSections.map(
            (section) => section.id
          )}
          strategy={verticalListSortingStrategy}
        >
          <nav className="builder-sections">
            {orderedSections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                isActive={
                  activeSection === section.id
                }
                onClick={() =>
                  onSectionChange(section.id)
                }
              />
            ))}
          </nav>
        </SortableContext>
      </DndContext>

      {availableSections.length > 0 && (
        <details className="builder-add-section-menu">
          <summary className="builder-add-section">
            <span className="material-symbols-outlined">
              add
            </span>

            Add Section
          </summary>

          <div className="builder-section-options">
            {availableSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  addSection(section.id)
                }
              >
                <span className="material-symbols-outlined">
                  {section.icon}
                </span>

                {section.label}
              </button>
            ))}
          </div>
        </details>
      )}

    </aside>
  );
}

export default SectionSidebar;