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
    label?: string;
    placeholder?: string;
    searchButtonText?: string;
    hideFloatingLabel?: boolean;
    hideSearchButton?: boolean;
    asHeading?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
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
    hideSearchButton = false,
    asHeading = false,
    onFocus,
    onBlur,
}: SearchbarProps) {
    const t = useLocale('general');
    const id = 'search_' + nanoid();

    const LabelWrapper = asHeading ? 'h6' : 'div';
    return (
        <Form onSubmit={submitSearch}>
            {label && (
                <LabelWrapper className={asHeading ? 'mt-4 mb-3' : ''}>
                    {hideFloatingLabel && <Form.Label htmlFor={id}>{label}</Form.Label>}
                </LabelWrapper>
            )}
            <InputGroup>
                {!hideFloatingLabel && label && (
                    <FloatingLabel controlId={id} label={label}>
                        <Form.Control
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={onFocus ?? undefined}
                            onBlur={onBlur ?? undefined}
                            type='text'
                            required
                            placeholder={placeholder ?? t('search')}
                            className='shadow-none'
                        />
                    </FloatingLabel>
                )}
                {hideFloatingLabel && (
                    <Form.Control
                        id={id}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={onFocus ?? undefined}
                        onBlur={onBlur ?? undefined}
                        type='text'
                        required
                        placeholder={placeholder ?? t('search')}
                    />
                )}
                <TooltipOverlay id='clear' tooltipMessage={t('clear')} placement='bottom'>
                    <InputGroup.Text className='d-none d-sm-flex'>
                        <CloseButton onClick={clearSearch} />
                    </InputGroup.Text>
                </TooltipOverlay>
                {!hideSearchButton && (
                    <Button type='submit' variant='outline-primary'>
                        {searchButtonText ?? t('search')}
                    </Button>
                )}
            </InputGroup>
        </Form>
    );
});

export default SearchBar;
