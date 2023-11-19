import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const useRichTextEditor = (
    content: string,
    updateContent?: React.Dispatch<React.SetStateAction<string>>,
    readOnly: boolean = updateContent ? false : true
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
        editorProps: {
            attributes: readOnly
                ? {}
                : {
                      class: 'form-control rounded-bottom-0',
                      style: 'height: 5.4rem; overflow-y: auto',
                  },
        },
    });
};
