import { EditorContent } from '@tiptap/react';
import { useInformOfError, useRichTextEditor, useTimeAgo } from '../../../hooks';
import { CommentRes } from '../../../types';
import './commentStyles.scss';
import { Card, Form } from 'react-bootstrap';
import { useLocale } from '../../../contexts/locale';
import { useCallback, useEffect, useState } from 'react';
import { DeleteButton, EditButton } from '../../../components';
import {
    useDeleteCommentMutation,
    useEditCommentMutation,
} from '../../../app/services/api';
import MenuBar from './MenuBar';

type CommentCardProps = {
    comment: CommentRes;
    allowEdit: boolean;
};

function CommentCard({ comment, allowEdit }: CommentCardProps) {
    const setT = useState(0)[1];
    useEffect(() => {
        const updateTimeAgo = setInterval(() => {
            setT(Date.now());
        }, 60000);

        return () => clearInterval(updateTimeAgo);
    }, [setT]);

    const timeAgo = useTimeAgo(comment.createdAt);

    const [editedContent, setEditedContent] = useState(() => comment.content);
    const [editing, setEditing] = useState(false);

    const displayer = useRichTextEditor(comment.content);
    const editor = useRichTextEditor(editedContent, setEditedContent, true);

    useEffect(() => {
        if (!displayer) {
            return undefined;
        }

        displayer?.commands.setContent(comment.content);
    }, [comment.content, displayer]);

    const resetContent = useCallback(() => {
        setEditedContent(comment.content);
    }, [comment.content]);

    const onEditingChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!editing && !allowEdit) return;
            if (editing) resetContent();
            setEditing(e.target.checked);
        },
        [allowEdit, editing, resetContent]
    );

    const stopEditing = () => {
        setEditing(false);
    };

    const [submitEdit, editOptions] = useEditCommentMutation();
    const [deleteComment, deleteOptions] = useDeleteCommentMutation();
    useInformOfError([
        { isError: editOptions.isError, error: editOptions.error },
        { isError: deleteOptions.isError, error: deleteOptions.error },
    ]);

    const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !editing ||
            editOptions.isLoading ||
            deleteOptions.isLoading ||
            comment.content === editedContent
        )
            return;
        submitEdit({ _id: comment._id, content: editedContent });
        stopEditing();
        return;
    };
    const handleDeleteComment = () => {
        deleteComment(comment._id);
    };

    const t = useLocale('itemPage');

    return (
        <Card className='border-bottom-0 border-start-0 border-end-0'>
            <Form onSubmit={handleSubmitComment}>
                <Card.Header className='small d-flex justify-content-between align-items-center border border-top-0 border-bottom-0 border-start-1 border-end-1'>
                    <div>
                        <span>{comment.authorName}</span>
                        <time className='text-secondary-emphasis'>{' - ' + timeAgo}</time>
                    </div>
                    {allowEdit && (
                        <div className='d-flex gap-2'>
                            <EditButton
                                editing={editing}
                                onChange={onEditingChange}
                                startEditMsg={t('editComment')}
                                cancelEditMsg={t('stopEdit')}
                                sm
                            />
                            <DeleteButton
                                handleDelete={handleDeleteComment}
                                disabled={
                                    editOptions.isLoading || deleteOptions.isLoading
                                }
                                isLoading={deleteOptions.isLoading}
                                tooltipMsg={t('deleteComment')}
                                outline
                                sm
                            />
                        </div>
                    )}
                </Card.Header>
                {!editing && <EditorContent editor={displayer} />}
                {editing && <EditorContent editor={editor} />}
                {editing && <MenuBar editor={editor} buttonText={t('save')} />}
            </Form>
        </Card>
    );
}

export default CommentCard;
