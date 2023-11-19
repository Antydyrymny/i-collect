import { Editor } from '@tiptap/react';
import { Button } from 'react-bootstrap';

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null;
    }

    return (
        <div>
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                bold
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                italic
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                strike
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
            >
                code
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            >
                h5
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                bullet list
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
                ordered list
            </Button>
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                undo
            </Button>
            <Button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                redo
            </Button>
        </div>
    );
}
