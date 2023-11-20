import { memo } from 'react';
import { useLazyRefreshHomeTagsQuery } from '../../app/services/api';
import ReactTagCloud, { TagCloudOptions } from '@frank-mayer/react-tag-cloud';
import { RefreshCcw } from 'lucide-react';
import styles from './homeStyles.module.scss';
import { Button, Col, Row } from 'react-bootstrap';
import { TooltipOverlay } from '../../components';

type TagCloudProps = {
    tags: string[];
    handleTagClick: (tag: string) => void;
};

const TagCloud = memo(function TagCloud({ tags, handleTagClick }: TagCloudProps) {
    const [refresHTags, tagOptions] = useLazyRefreshHomeTagsQuery();
    const handleRefresh = () => {
        refresHTags();
    };

    return (
        <Row>
            <Col className='d-flex justify-content-center'>
                <div className='position-relative'>
                    <ReactTagCloud
                        className={styles.tagCloud}
                        options={(w: Window & typeof globalThis): TagCloudOptions => ({
                            radius: Math.min(500, w.innerWidth, w.innerHeight) / 2.4,
                            maxSpeed: 'fast',
                        })}
                        onClick={handleTagClick}
                        onClickOptions={{ passive: true }}
                    >
                        {tags}
                    </ReactTagCloud>
                    <TooltipOverlay id='tag-cloud-refresh' tooltipMessage='Refresh tags'>
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
            </Col>
        </Row>
    );
});

export default TagCloud;
