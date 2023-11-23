import { useEffect } from 'react';
import { useRichTextEditor } from '../../../hooks';
import { EditorContent } from '@tiptap/react';
import MenuBar from '../../../pages/item/comment/MenuBar';
import { useLocale } from '../../../contexts/locale';
import './commentStyles.scss';

type RichTextInputProps = {
    initialContent: string;
    editedContent: string;
    setEditedContent: (arg: string) => void;
    editing: boolean;
    placeholder: string;
    required?: boolean;
    sm?: boolean;
    xs?: boolean;
};

function RichTextInput({
    initialContent,
    editedContent,
    setEditedContent,
    editing,
    placeholder,
    required = false,
    sm = false,
    xs = false,
}: RichTextInputProps) {
    useEffect(() => {
        if (!editing) setEditedContent(initialContent);
    }, [editing, initialContent, setEditedContent]);

    const displayer = useRichTextEditor({ content: initialContent, asComment: false });
    const editor = useRichTextEditor({
        content: editedContent,
        updateContent: setEditedContent,
        editable: true,
        placeholder,
        asComment: false,
    });

    useEffect(() => {
        if (!displayer) {
            return undefined;
        }

        displayer?.commands.setContent(initialContent);
    }, [initialContent, displayer]);

    const t = useLocale('itemPage');

    return (
        <>
            {!editing && <EditorContent editor={displayer} />}
            {editing && (
                <EditorContent
                    editor={editor}
                    required={required}
                    placeholder={placeholder}
                />
            )}
            {editing && (
                <MenuBar editor={editor} buttonText={t('save')} sm={sm} xs={xs} />
            )}
        </>
    );
}

export default RichTextInput;
