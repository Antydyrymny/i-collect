import { useState } from 'react';
import { useNewCommentMutation } from '../../../app/services/api';
import { useInformOfError, useRichTextEditor } from '../../../hooks';
import { EditorContent } from '@tiptap/react';
import MenuBar from './MenuBar';
import { Button, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import './commentStyles.scss';

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

    const editor = useRichTextEditor(newComment, setNewComment);

    const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newCommentOptions.isLoading) return;
        leaveAComment({ toItem: itemId!, content: newComment });
        if (editor) editor.commands.clearContent();
    };

    return (
        <Form onSubmit={handleSubmitComment}>
            <Form.Group controlId='newComment'>
                <Form.Label className='text-center'>
                    <span>Leave a comment as </span>
                    <Link
                        to={ClientRoutes.UserPagePath + userId}
                        className='text-decoration-underline text-primary-emphasis'
                    >
                        {userName}
                    </Link>
                </Form.Label>
                <EditorContent editor={editor} />
                <Card className='rounded-top-0 rounded-bottom-2 border-top-0'>
                    <Card.Body className='p-0 rounded-top-0 rounded-bottom-2 bg-body-tertiary'>
                        <div className='my-2 mx-3 d-flex justify-content-between align-items-center'>
                            <MenuBar editor={editor} />
                            <Button type='submit' variant='outline-primary' size='sm'>
                                Send comment
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Form.Group>
        </Form>
    );
}

export default NewComment;
