import {
    Button,
    Card,
    CloseButton,
    FloatingLabel,
    Form,
    InputGroup,
} from 'react-bootstrap';
import { fieldTypes } from '../../../data';
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
    return (
        <Card className='mt-4'>
            <Card.Body>
                <h6 className='mt-2 mb-4'>Additional fields</h6>
                {optionalFields.map((optionalField, ind) => (
                    <InputGroup key={ind} className='mb-4'>
                        <FloatingLabel label={'Field name'}>
                            <Form.Control
                                type='text'
                                value={optionalField.fieldName}
                                onChange={changeOptionalFields(ind, 'name')}
                                placeholder={'Name'}
                                required
                                className='shadow-none'
                            />
                        </FloatingLabel>
                        <FloatingLabel label={'Field Type'}>
                            <Form.Select
                                value={optionalField.fieldType}
                                onChange={changeOptionalFields(ind, 'type')}
                                placeholder={'Type'}
                                required
                                className='shadow-none'
                            >
                                {fieldTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        <TooltipOverlay
                            id='clear'
                            tooltipMessage={'Delete'}
                            placement='bottom'
                        >
                            <InputGroup.Text className='d-none d-sm-flex'>
                                <CloseButton onClick={() => deleteOptionalField(ind)} />
                            </InputGroup.Text>
                        </TooltipOverlay>
                    </InputGroup>
                ))}
                <Button onClick={addOptionalField} className='mb-2'>
                    + Add field
                </Button>
            </Card.Body>
        </Card>
    );
}

export default OptionalFields;
