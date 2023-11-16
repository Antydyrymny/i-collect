import { memo } from 'react';
import { Button, CloseButton, FloatingLabel, Form, InputGroup } from 'react-bootstrap';
import { TooltipOverlay } from '../..';
import { useLocale } from '../../../contexts/locale';

type SearchbarProps = {
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
    submitSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    label: string;
    placeholder: string;
    searchButtonText?: string;
    hideFloatingLabel?: boolean;
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
}: SearchbarProps) {
    const t = useLocale('general');

    return (
        <Form onSubmit={submitSearch}>
            {hideFloatingLabel && <Form.Label>{label}</Form.Label>}
            <InputGroup>
                {!hideFloatingLabel && (
                    <FloatingLabel controlId='collectionSearch' label={label}>
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
