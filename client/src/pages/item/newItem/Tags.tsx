import { useEffect, useState } from 'react';
import { useLocale } from '../../../contexts/locale';
import { useAutocompleteTagQuery } from '../../../app/services/api';
import { CloseButton, Col, Container, Dropdown, Row, Spinner } from 'react-bootstrap';
import { SearchBar, TooltipOverlay } from '../../../components';

type TagsProps = {
    tags: string[];
    addTag: (tag: string) => () => void;
    removeTag: (tag: string) => () => void;
    submitCurTag: (tag: string) => (e: React.FormEvent<HTMLFormElement>) => void;
};

function Tags({ tags, addTag, removeTag, submitCurTag }: TagsProps) {
    const [curTag, setCurTag] = useState('');
    const handleCurTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurTag(e.target.value);
    };
    const clearCurTag = () => {
        setCurTag('');
    };

    useEffect(() => {
        setCurTag('');
    }, [tags]);

    const { data: tagSuggestions, ...tagSearchOptions } = useAutocompleteTagQuery(curTag);

    const t = useLocale('newItem');

    return (
        <>
            <Row>
                <Col xs={12} lg={6} className='position-relative'>
                    <SearchBar
                        searchQuery={curTag}
                        handleSearchChange={handleCurTagChange}
                        clearSearch={clearCurTag}
                        submitSearch={submitCurTag(curTag)}
                        label={t('tagSearchLabel')}
                        placeholder={t('tagPlaceholder')}
                        searchButtonText={t('tagSubmit')}
                        hideFloatingLabel
                    />
                    <Dropdown.Menu
                        show={!!tagSuggestions?.length}
                        className='end-0 start-0'
                        style={{ marginInline: '0.75rem' }}
                    >
                        {tagSearchOptions.isFetching && (
                            <Container className='d-flex justify-content-center'>
                                <Spinner />
                            </Container>
                        )}
                        {tagSuggestions?.map((suggestedTag, ind) => (
                            <Dropdown.Item key={ind} onClick={addTag(suggestedTag)}>
                                {suggestedTag}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Col>
            </Row>
            <Row>
                <Col xs={12} lg={6} className='mt-3'>
                    <h5>
                        {tags.map((tag, ind) => (
                            <span
                                key={ind}
                                className='badge border border-primary text-primary
                                                rounded-5 me-2 mb-2 ps-3 d-inline-flex align-items-center '
                            >
                                {tag}
                                <TooltipOverlay
                                    id={'delete' + tag}
                                    tooltipMessage={t('delete')}
                                >
                                    <CloseButton
                                        onClick={removeTag(tag)}
                                        style={{ scale: '0.7' }}
                                    />
                                </TooltipOverlay>
                            </span>
                        ))}
                    </h5>
                </Col>
            </Row>
        </>
    );
}

export default Tags;
