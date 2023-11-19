import { EditorContent } from '@tiptap/react';
import {
    useEditing,
    useInformOfError,
    useRichTextEditor,
    useTimeAgo,
} from '../../../hooks';
import { CommentRes } from '../../../types';
import './commentStyles.scss';
import { Card } from 'react-bootstrap';
import { useLocale } from '../../../contexts/locale';
import { useCallback, useEffect, useState } from 'react';
import { DeleteButton, EditButton } from '../../../components';
import {
    useDeleteCommentMutation,
    useEditCommentMutation,
} from '../../../app/services/api';

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

    const [content, setContent] = useState(() => comment.content);

    const editor = useRichTextEditor(comment.content);

    const { editing, startEditing, stopEditing } = useEditing(allowEdit);
    const cancelEdit = () => {
        stopEditing();
        if (editor) editor.commands.setContent(comment.content);
    };

    const [editComment, editOptions] = useEditCommentMutation();
    const [deleteComment, deleteOptions] = useDeleteCommentMutation();
    useInformOfError([
        { isError: editOptions.isError, error: editOptions.error },
        { isError: deleteOptions.isError, error: deleteOptions.error },
    ]);

    const handleDeleteComment = () => {
        deleteComment(comment._id);
    };

    return (
        <Card>
            <Card.Header className='small d-flex justify-content-between align-items-center'>
                <div>
                    <span>{comment.authorName}</span>
                    <time className='text-secondary-emphasis'>{' - ' + timeAgo}</time>
                </div>
                {allowEdit && (
                    <div className='d-flex gap-2'>
                        <EditButton
                            editing={editing}
                            startEditing={startEditing}
                            startEditMsg='Edit comment'
                            cancelEdit={cancelEdit}
                            cancelEditMsg='Cancel edit'
                            outline
                            sm
                        />
                        <DeleteButton
                            handleDelete={handleDeleteComment}
                            disabled={editOptions.isLoading || deleteOptions.isLoading}
                            isLoading={deleteOptions.isLoading}
                            tooltipMsg='Delete comment'
                            outline
                            sm
                        />
                    </div>
                )}
            </Card.Header>
            <Card.Body>
                <EditorContent editor={editor} />
            </Card.Body>
        </Card>
    );
}

export default CommentCard;
