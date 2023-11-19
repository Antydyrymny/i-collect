import { memo } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useLocale } from '../../../contexts/locale';
import like from '../../../assets/like.png';
import noLike from '../../../assets/like-no.png';
import noLikeDark from '../../../assets/like-no-dark.png';
import { TooltipOverlay } from '../..';
import { Button, Image } from 'react-bootstrap';
import { useThemeContext } from '../../../contexts/theme';

type LikeButtonProps = {
    liked: boolean;
    handleLike: () => void;
    notAllowed?: boolean;
    totalLikes?: number;
};

const LikeButton = memo(function LikeButton({
    liked,
    handleLike,
    notAllowed,
    totalLikes,
}: LikeButtonProps) {
    const t = useLocale('general');
    const tooltipMessage = notAllowed
        ? t('likeNotAllowed')
        : liked
        ? t('noLike')
        : t('like');

    const { theme } = useThemeContext();
    return (
        <div>
            <TooltipOverlay id={'like' + nanoid()} tooltipMessage={tooltipMessage}>
                <Button
                    onClick={handleLike}
                    disabled={notAllowed}
                    variant={liked ? 'primary' : 'outline-primary'}
                    className='d-flex gap-2'
                >
                    <Image
                        src={liked ? like : theme === 'dark' ? noLikeDark : noLike}
                        alt={tooltipMessage}
                    />
                    {totalLikes !== undefined && (
                        <span className='text-body'>{totalLikes}</span>
                    )}
                </Button>
            </TooltipOverlay>
        </div>
    );
});

export default LikeButton;
