import { useState } from 'react';
import { useNewCommentMutation } from '../../../app/services/api';
import { useInformOfError, useRichTextEditor } from '../../../hooks';
import { EditorContent } from '@tiptap/react';
import MenuBar from './MenuBar';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import './commentStyles.scss';
import { useLocale } from '../../../contexts/locale';

type NewCommentProps = {
    itemId: string;
    userId: string;
    userName: string;
};

function NewComment({ itemId, userName, userId }: NewCommentProps) {
    const [newComment, setNewComment] = useState('');

    const [leaveAComment, newCommentOptions] = useNewCommentMutation();
    useInformOfError({
        isError: newCommentOptions.isError,
        error: newCommentOptions.error,
    });

    const editor = useRichTextEditor(newComment, setNewComment, true);

    const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newCommentOptions.isLoading) return;
        leaveAComment({ toItem: itemId!, content: newComment });
        if (editor) editor.commands.clearContent();
    };

    const t = useLocale('itemPage');

    return (
        <Form onSubmit={handleSubmitComment} className='mt-2'>
            <Form.Group controlId='newComment'>
                <Form.Label className='text-center'>
                    <span>{t('commentAs')}</span>
                    <Link
                        to={ClientRoutes.UserPagePath + userId}
                        className='text-decoration-underline text-primary-emphasis'
                    >
                        {userName}
                    </Link>
                </Form.Label>
                <EditorContent editor={editor} />
                <MenuBar editor={editor} buttonText={t('comment')} />
            </Form.Group>
        </Form>
    );
}

export default NewComment;
