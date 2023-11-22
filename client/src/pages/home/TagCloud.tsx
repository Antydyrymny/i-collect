import { memo } from 'react';
import { useLazyRefreshHomeTagsQuery } from '../../app/services/api';
import ReactTagCloud, { TagCloudOptions } from '@frank-mayer/react-tag-cloud';
import { RefreshCcw } from 'lucide-react';
import styles from './homeStyles.module.scss';
import { Button } from 'react-bootstrap';
import { TooltipOverlay } from '../../components';
import { useBreakpoints } from '../../hooks';
import { useLocale } from '../../contexts/locale';

type TagCloudProps = {
    tags: string[];
    handleTagClick: (tag: string) => void;
};

const TagCloud = memo(function TagCloud({ tags, handleTagClick }: TagCloudProps) {
    const [refresHTags, tagOptions] = useLazyRefreshHomeTagsQuery();
    const handleRefresh = () => {
        refresHTags();
    };

    const screenSize = useBreakpoints();
    let radius = 100;
    switch (screenSize) {
        case 'xxl':
            radius = 220;
            break;
        case 'xl':
            radius = 200;
            break;
        case 'lg':
            radius = 180;
            break;
        case 'md':
            radius = 160;
            break;
        case 'sm':
            radius = 140;
            break;
        case 'xs':
            radius = 120;
            break;
    }

    const t = useLocale('home');

    return (
        <div className='position-relative'>
            <ReactTagCloud
                className={styles.tagCloud}
                options={(): TagCloudOptions => ({
                    radius: radius,
                    maxSpeed: 'fast',
                })}
                onClick={handleTagClick}
                onClickOptions={{ passive: true }}
            >
                {tags}
            </ReactTagCloud>
            <TooltipOverlay id='tag-cloud-refresh' tooltipMessage={t('refreshTags')}>
                <Button
                    className='position-absolute bottom-0 end-0'
                    size='sm'
                    variant='outline'
                    onClick={handleRefresh}
                    disabled={tagOptions.isFetching}
                >
                    <RefreshCcw size={16} />
                </Button>
            </TooltipOverlay>
        </div>
    );
});

export default TagCloud;
