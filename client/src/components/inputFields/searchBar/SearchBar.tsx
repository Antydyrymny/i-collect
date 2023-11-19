import React, { memo } from 'react';
import { Button, CloseButton, FloatingLabel, Form, InputGroup } from 'react-bootstrap';
import { TooltipOverlay } from '../..';
import { useLocale } from '../../../contexts/locale';
import { nanoid } from '@reduxjs/toolkit';

type SearchbarProps = {
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
    submitSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    label: string;
    placeholder: string;
    searchButtonText?: string;
    hideFloatingLabel?: boolean;
    asHeading?: boolean;
};

const SearchBar = memo(function SearchBar({
    searchQuery,
    handleSearchChange,
    clearSearch,
    submitSearch,
    label,
    placeholder,
    searchButtonText,
    hideFloatingLabel = false,
    asHeading = false,
}: SearchbarProps) {
    const t = useLocale('general');
    const id = 'search_' + nanoid();

    const LabelWrapper = asHeading ? 'h6' : 'div';
    return (
        <Form onSubmit={submitSearch}>
            <LabelWrapper className={asHeading ? 'mt-4 mb-3' : ''}>
                {hideFloatingLabel && <Form.Label htmlFor={id}>{label}</Form.Label>}
            </LabelWrapper>
            <InputGroup>
                {!hideFloatingLabel && (
                    <FloatingLabel controlId={id} label={label}>
                        <Form.Control
                            value={searchQuery}
                            onChange={handleSearchChange}
                            type='text'
                            required
                            placeholder={placeholder}
                            className='shadow-none'
                        />
                    </FloatingLabel>
                )}
                {hideFloatingLabel && (
                    <Form.Control
                        id={id}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        type='text'
                        required
                        placeholder={placeholder}
                    />
                )}
                <TooltipOverlay id='clear' tooltipMessage={t('clear')} placement='bottom'>
                    <InputGroup.Text className='d-none d-sm-flex'>
                        <CloseButton onClick={clearSearch} />
                    </InputGroup.Text>
                </TooltipOverlay>
                <Button type='submit' variant='outline-primary'>
                    {searchButtonText ?? t('search')}
                </Button>
            </InputGroup>
        </Form>
    );
});

export default SearchBar;
