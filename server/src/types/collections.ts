import { Schema } from 'mongoose';

export type ItemCollection = {
    name: string;
    description: string;
    theme: CollectionTheme;
    image?: string;
    authorId: Schema.Types.ObjectId;
    format: FormatField[];
    itemModelName: string;
};

export type FormatField = {
    fieldType: FieldType;
    fieldName: string;
};
export type FieldType = 'Boolean' | 'Number' | 'String' | 'Text' | 'Date';
export type CollectionTheme = 'Books' | 'Signs' | 'Films' | 'Other';
