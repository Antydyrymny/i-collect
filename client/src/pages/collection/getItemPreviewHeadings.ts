import { FormatField } from '../../types';

const maxPreviewFields = +import.meta.env.VITE_MAX_ITEM_PREVIEW_FIELDS;
const ordering = ['string', 'date'] as const;

export const getItemPreviewHeadings = (formatFields: FormatField[]) => {
    const headings: string[] = [];
    for (const fieldType of ordering) {
        for (const field of formatFields) {
            if (field.fieldType !== fieldType || headings.includes(field.fieldName))
                continue;
            headings.push(field.fieldName);
            if (headings.length === maxPreviewFields) return headings;
        }
    }
    return headings;
};
