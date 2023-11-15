import {
    Button,
    Card,
    CloseButton,
    FloatingLabel,
    Form,
    InputGroup,
} from 'react-bootstrap';
import { fieldTypes } from '../../../data';
import { useLocale } from '../../../contexts/locale';
import TooltipOverlay from '../../../components/tooltip/TooltipOverlay';
import { FormatField } from '../../../types';

type OptionalFieldsProps = {
    optionalFields: FormatField[];
    addOptionalField: () => void;
    deleteOptionalField: (ind: number) => void;
    changeOptionalFields: <T extends 'name' | 'type'>(
        ind: number,
        fieldParam: T
    ) => (
        e: T extends 'name'
            ? React.ChangeEvent<HTMLInputElement>
            : React.ChangeEvent<HTMLSelectElement>
    ) => void;
};

function OptionalFields({
    optionalFields,
    addOptionalField,
    deleteOptionalField,
    changeOptionalFields,
}: OptionalFieldsProps) {
    const t = useLocale('newCollection');
    const tDict = useLocale('dictionary');

    return (
        <Card className='mt-4'>
            <Card.Body>
                <h6 className='mt-2 mb-4'>{t('additionalFields')}</h6>
                {optionalFields.map((optionalField, ind) => (
                    <InputGroup key={ind} className='mb-4'>
                        <FloatingLabel label={t('optionalFieldName')}>
                            <Form.Control
                                type='text'
                                value={optionalField.fieldName}
                                onChange={changeOptionalFields(ind, 'name')}
                                placeholder={t('optionalFieldName')}
                                required
                                className='shadow-none'
                                maxLength={255}
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t('optionalFieldType')}>
                            <Form.Select
                                value={optionalField.fieldType}
                                onChange={changeOptionalFields(ind, 'type')}
                                placeholder={t('optionalFieldType')}
                                required
                                className='shadow-none'
                            >
                                {fieldTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {tDict(type)}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        <TooltipOverlay
                            id='clear'
                            tooltipMessage={t('delete')}
                            placement='bottom'
                        >
                            <InputGroup.Text className='d-none d-sm-flex'>
                                <CloseButton onClick={() => deleteOptionalField(ind)} />
                            </InputGroup.Text>
                        </TooltipOverlay>
                    </InputGroup>
                ))}
                <Button onClick={addOptionalField} className='mb-2'>
                    {t('addField')}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default OptionalFields;
