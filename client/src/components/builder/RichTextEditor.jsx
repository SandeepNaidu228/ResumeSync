import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor({
  value,
  onChange,
  placeholder = "Describe your experience...",
}) {
  const editor = useEditor({
    extensions: [StarterKit],

    content: value || "",

    editorProps: {
      attributes: {
        class: "rich-text-content",
      },

      handleKeyDown(view, event) {
        if (
          event.key === "Enter" &&
          event.shiftKey
        ) {
          return false;
        }

        return false;
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const nextHtml = value || "";

    if (
      nextHtml !== currentHtml &&
      nextHtml !== "<p></p>"
    ) {
      editor.commands.setContent(nextHtml, {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rich-text-loading">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">

      <div className="rich-text-toolbar">

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={
            editor.isActive("bold")
              ? "active"
              : ""
          }
          title="Bold"
        >
          <span className="material-symbols-outlined">
            format_bold
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={
            editor.isActive("italic")
              ? "active"
              : ""
          }
          title="Italic"
        >
          <span className="material-symbols-outlined">
            format_italic
          </span>
        </button>

        <span className="rich-text-toolbar-divider" />

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={
            editor.isActive("bulletList")
              ? "active"
              : ""
          }
          title="Bullet list"
        >
          <span className="material-symbols-outlined">
            format_list_bulleted
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={
            editor.isActive("orderedList")
              ? "active"
              : ""
          }
          title="Numbered list"
        >
          <span className="material-symbols-outlined">
            format_list_numbered
          </span>
        </button>

        <span className="rich-text-toolbar-spacer" />

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
          disabled={
            !editor.can().chain().focus().undo().run()
          }
          title="Undo"
        >
          <span className="material-symbols-outlined">
            undo
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
          disabled={
            !editor.can().chain().focus().redo().run()
          }
          title="Redo"
        >
          <span className="material-symbols-outlined">
            redo
          </span>
        </button>

      </div>

      <EditorContent editor={editor} />

      {!value && (
        <div className="rich-text-placeholder">
          {placeholder}
        </div>
      )}

    </div>
  );
}

export default RichTextEditor;