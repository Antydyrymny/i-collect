import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FieldType, FieldValueMap } from '../../../types';
import dayjs from 'dayjs';

type ExtendedFieldValueMap = FieldValueMap & { select: string };

type GenericInputFieldProps<T extends FieldType | 'select'> = {
    type: T;
    value: ExtendedFieldValueMap[T];
    onChange: (
        e: T extends FieldType
            ? React.ChangeEvent<HTMLInputElement>
            : React.ChangeEvent<HTMLSelectElement>
    ) => void;
    editing?: boolean;
    label?: string;
    placeholder?: string;
    inlineLabel?: boolean;
    inlineProportions?: [number, number];
    asHeading?: boolean;
} & (T extends 'select' ? { options: string[] } : { options?: never });

// eslint-disable-next-line react-refresh/only-export-components
function GenericInputField<T extends FieldType | 'select'>({
    type,
    value,
    onChange,
    editing = true,
    label,
    placeholder,
    inlineLabel = true,
    asHeading = false,
    inlineProportions = asHeading ? [12, 0] : [3, 9],
    options,
}: GenericInputFieldProps<T>) {
    let mainComponent;

    if (!editing) {
        let val;
        switch (type) {
            case 'string':
            case 'text':
            case 'number':
            case 'select': {
                val = value;
                break;
            }
            case 'boolean': {
                val = value ? 'True' : 'False';
                break;
            }
            case 'date': {
                val = dayjs(value as Date).format('D MMM, YYYY');
                break;
            }
        }
        mainComponent = asHeading ? (
            <h2 className='mb-2'>{val as string | number}</h2>
        ) : (
            <p className='mb-0' style={{ paddingTop: '0.4375rem' }}>
                {val as string | number}
            </p>
        );
    } else {
        switch (type) {
            case 'string':
            case 'text':
            case 'number':
            case 'date': {
                const val =
                    type === 'date' ? dayjs(value as Date).format('YYYY-MM-DD') : value;
                mainComponent = (
                    <Form.Control
                        type={type !== 'text' ? type : undefined}
                        as={type === 'text' ? 'textarea' : undefined}
                        rows={type === 'text' ? 3 : undefined}
                        maxLength={type === 'string' ? 255 : undefined}
                        value={val as string | number}
                        onChange={
                            onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
                        }
                        placeholder={placeholder}
                        required
                        size={asHeading ? 'lg' : undefined}
                        style={{ cursor: 'text' }}
                    />
                );
                break;
            }
            case 'boolean': {
                mainComponent = (
                    <Form.Check
                        checked={value as boolean}
                        onChange={
                            onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
                        }
                        type='switch'
                    />
                );
                break;
            }
            case 'select': {
                mainComponent = (
                    <Form.Select
                        value={value as string}
                        onChange={
                            onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
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
            className={`${asHeading ? 'mb-md-0 mb-4' : 'mb-3'}`}
            style={{ maxHeight: asHeading ? '2.57625rem' : undefined }}
        >
            {!!label && (
                <Form.Label
                    column={inlineLabel || undefined}
                    sm={inlineLabel ? labelCol : undefined}
                    className={inlineLabel ? 'text-secondary-emphasis' : ''}
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {label}
                </Form.Label>
            )}
            <Col
                className={
                    type === 'boolean' && editing ? 'd-flex align-items-center' : ''
                }
                style={{ marginBottom: type === 'text' && !editing ? '0.4375rem' : '0' }}
                sm={inlineLabel ? inputCol : undefined}
            >
                {mainComponent}
            </Col>
        </Form.Group>
    );
}

export default React.memo(GenericInputField) as typeof GenericInputField;
