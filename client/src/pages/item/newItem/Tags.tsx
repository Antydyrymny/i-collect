import { useEffect, useState } from 'react';
import { useLocale } from '../../../contexts/locale';
import { useAutocompleteTagQuery } from '../../../app/services/api';
import { CloseButton, Col, Container, Dropdown, Row, Spinner } from 'react-bootstrap';
import { SearchBar, TooltipOverlay } from '../../../components';

type TagsProps = {
    editing?: boolean;
    tags: string[];
    addTag: (tag: string) => () => void;
    removeTag: (tag: string) => () => void;
    submitCurTag: (tag: string) => (e: React.FormEvent<HTMLFormElement>) => void;
    asHeading?: boolean;
};

function Tags({
    editing = true,
    tags,
    addTag,
    removeTag,
    submitCurTag,
    asHeading = false,
}: TagsProps) {
    const [curTag, setCurTag] = useState('');
    const handleCurTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurTag(e.target.value);
    };
    const clearCurTag = () => {
        setCurTag('');
    };

    const { data: tagSuggestions, ...tagSearchOptions } = useAutocompleteTagQuery(curTag);

    useEffect(() => {
        setCurTag('');
    }, [tags]);

    const t = useLocale('newItem');
    const tItem = useLocale('itemPage');

    return (
        <>
            <Row>
                <Col xs={12} lg={6} className='position-relative'>
                    {!editing && asHeading && (
                        <h6 className='mt-4 mb-3'>{tItem('tags')}</h6>
                    )}
                    {editing && (
                        <>
                            <SearchBar
                                searchQuery={curTag}
                                handleSearchChange={handleCurTagChange}
                                clearSearch={clearCurTag}
                                submitSearch={submitCurTag(curTag)}
                                label={t('tagSearchLabel')}
                                placeholder={t('tagPlaceholder')}
                                searchButtonText={t('tagSubmit')}
                                hideFloatingLabel
                                asHeading={asHeading}
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
                                    <Dropdown.Item
                                        key={ind}
                                        onClick={addTag(suggestedTag)}
                                    >
                                        {suggestedTag}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </>
                    )}
                </Col>
            </Row>
            <Row>
                <Col xs={12} lg={6} className={editing ? 'mt-4' : 'mt-3'}>
                    <h5>
                        {tags.map((tag, ind) => (
                            <span
                                key={ind}
                                className='badge border border-primary text-primary
                                                rounded-5 me-2 mb-2 ps-3 d-inline-flex align-items-center'
                            >
                                <span className={`${!editing && 'py-1 pe-2'}`}>
                                    {tag}
                                </span>
                                {editing && (
                                    <TooltipOverlay
                                        id={'delete' + tag}
                                        tooltipMessage={t('delete')}
                                    >
                                        <CloseButton
                                            onClick={removeTag(tag)}
                                            style={{ scale: '0.7' }}
                                        />
                                    </TooltipOverlay>
                                )}
                            </span>
                        ))}
                    </h5>
                </Col>
            </Row>
        </>
    );
}

export default Tags;
