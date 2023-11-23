import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

type RichTextEditorPorps = {
    content: string;
    updateContent?: (arg: string) => void;
    editable?: boolean;
    asComment?: boolean;
    placeholder?: string;
};
export const useRichTextEditor = ({
    content,
    updateContent,
    editable = false,
    asComment = true,
    placeholder = '',
}: RichTextEditorPorps) => {
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
            Placeholder.configure({
                placeholder,
                showOnlyWhenEditable: false,
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
                ? asComment
                    ? {
                          class: 'form-control rounded-top-0 rounded-bottom-0',
                          style: 'height: 5.4rem; overflow-y: auto',
                      }
                    : {
                          class: 'form-control  rounded-bottom-0',
                          style: 'height: 5.4rem; overflow-y: auto',
                      }
                : asComment
                ? { class: 'form-control rounded-top-0 rounded-bottom-2' }
                : {},
        },
    });
};
