import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const useRichTextEditor = (
    content: string,
    updateContent?: React.Dispatch<React.SetStateAction<string>>,
    editable = false
) => {
    return useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        content,
        onUpdate: !updateContent
            ? undefined
            : ({ editor }) => {
                  updateContent(editor.getHTML());
              },
        editable,
        editorProps: {
            attributes: editable
                ? {
                      class: 'form-control rounded-top-0 rounded-bottom-0',
                      style: 'height: 5.4rem; overflow-y: auto',
                  }
                : { class: 'form-control rounded-top-0 rounded-bottom-2' },
        },
    });
};
