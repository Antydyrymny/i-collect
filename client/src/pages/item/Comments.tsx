import { useRef, useState } from 'react';
import { useGetItemCommentsQuery } from '../../app/services/api';
import { useInfiniteScrollLoading, useInformOfError } from '../../hooks';
import { Col, Row } from 'react-bootstrap';
import { useSelectUser } from '../../app/services/features/auth';

import NewComment from './comment/NewComment';
import CommentCard from './comment/CommentCard';

type CommentsProps = {
    itemId: string | undefined;
};

function Comments({ itemId }: CommentsProps) {
    const [page, setPage] = useState(0);
    const { data: commentsData, ...commentOptions } = useGetItemCommentsQuery(
        {
            itemId: itemId!,
            page,
        },
        { skip: !itemId }
    );
    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useInfiniteScrollLoading(
        pageBottomRef,
        () => setPage((page) => page + 1),
        commentOptions.isFetching,
        commentsData?.moreToFetch ?? true
    );
    useInformOfError({ isError: commentOptions.isError, error: commentOptions.error });

    const user = useSelectUser();

    return (
        <>
            <Row className='my-4 mb-5'>
                <Col>
                    {!user._id && (
                        <p className='text-secondary-emphasis'>
                            Sign in to leave comments
                        </p>
                    )}
                    {itemId && user._id && (
                        <NewComment
                            itemId={itemId}
                            userId={user._id}
                            userName={user.name!}
                        />
                    )}
                </Col>
            </Row>
            {commentsData?.comments.map((comment) => (
                <Row key={comment._id} className='mt-4'>
                    <Col>
                        <CommentCard
                            comment={comment}
                            allowEdit={user.admin || user._id === comment.authorId}
                        />
                    </Col>
                </Row>
            ))}
            <span ref={pageBottomRef} />
        </>
    );
}

export default Comments;
