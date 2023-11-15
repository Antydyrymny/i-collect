import { Col, Form, Row } from 'react-bootstrap';
import { FieldType, FieldValueMap } from '../../types';
import dayjs from 'dayjs';

type ExtendedFieldValueMap = FieldValueMap & { select: string };

type EditInputFieldProps<T extends FieldType | 'select'> = {
    type: T;
    originalValue: ExtendedFieldValueMap[T];
    editedValue: ExtendedFieldValueMap[T];
    editing: boolean;
    onEdit: (
        e: T extends 'string' | 'text' | 'boolean' | 'number' | 'date'
            ? React.ChangeEvent<HTMLInputElement>
            : React.ChangeEvent<HTMLSelectElement>
    ) => void;
    label?: string;
    inlineLabel?: boolean;
    inlineProportions?: [number, number];
    asHeading?: boolean;
} & (T extends 'select' ? { options: string[] } : { options?: never });

function EditInputField<T extends FieldType | 'select'>({
    type,
    originalValue,
    editedValue,
    editing,
    onEdit,
    label,
    inlineLabel = true,
    inlineProportions = [3, 9],
    asHeading = false,
    options,
}: EditInputFieldProps<T>) {
    let mainComponent;

    if (!editing) {
        let val;
        switch (type) {
            case 'string':
            case 'text':
            case 'number':
            case 'select': {
                val = editedValue;
                break;
            }
            case 'boolean': {
                val = editedValue ? 'True' : 'False';
                break;
            }
            case 'date': {
                val = dayjs(editedValue as Date).format('HH:mm:ss, D MMM, YYYY');
                break;
            }
        }
        mainComponent = asHeading ? (
            <h2>{val as string | number}</h2>
        ) : (
            <p className='mb-0'>{val as string | number}</p>
        );
    } else {
        switch (type) {
            case 'string':
            case 'text':
            case 'number':
            case 'date': {
                const val =
                    type === 'date'
                        ? dayjs(editedValue as Date).format('YYYY-MM-DD')
                        : editedValue;
                const placeholder =
                    type === 'date'
                        ? dayjs(originalValue as Date).format('YYYY-MM-DD')
                        : originalValue.toString();
                mainComponent = (
                    <Form.Control
                        type={type !== 'text' ? type : undefined}
                        as={type === 'text' ? 'textarea' : undefined}
                        rows={type === 'text' ? 3 : undefined}
                        maxLength={type === 'string' ? 255 : undefined}
                        value={val as string | number}
                        onChange={
                            onEdit as (e: React.ChangeEvent<HTMLInputElement>) => void
                        }
                        placeholder={placeholder}
                        required
                        size={asHeading ? 'lg' : undefined}
                    />
                );
                break;
            }
            case 'boolean': {
                mainComponent = (
                    <Form.Check
                        checked={editedValue as boolean}
                        onChange={
                            onEdit as (e: React.ChangeEvent<HTMLInputElement>) => void
                        }
                    />
                );
                break;
            }
            case 'select': {
                mainComponent = (
                    <Form.Select
                        value={editedValue as string}
                        onChange={
                            onEdit as (e: React.ChangeEvent<HTMLSelectElement>) => void
                        }
                        required
                        size={asHeading ? 'lg' : undefined}
                    >
                        {options!.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                );
                break;
            }
        }
    }

    const [labelCol, inputCol] = inlineProportions;
    return (
        <Form.Group
            as={inlineLabel ? Row : undefined}
            controlId={editing ? label : undefined}
            className={`${editing ? '' : 'd-flex align-items-center'} ${
                asHeading ? 'mb-2' : 'mb-3'
            }`}
            style={{ maxHeight: asHeading ? '2.57625rem' : undefined }}
        >
            {!!label && (
                <Form.Label column={inlineLabel || undefined} sm={labelCol}>
                    {label}
                </Form.Label>
            )}
            <Col sm={inputCol}>{mainComponent}</Col>
        </Form.Group>
    );
}

export default EditInputField;
