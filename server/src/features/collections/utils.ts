import { ItemResFormatField, ItemModelType, ItemPreview } from '../../types';

export const getItemPreview = (item: ItemModelType): ItemPreview => {
    const previewFields: ItemResFormatField[] = [];
    const ordering = [
        'stringFields',
        'dateFields',
        'booleanFields',
        'numberFields',
    ] as const;
    main: for (const fieldType of ordering) {
        for (const [key, value] of Array.from(
            (item[fieldType] as Map<string, boolean | number | Date>).entries()
        )) {
            previewFields.push({ [key]: value });
            if (previewFields.length === 4) break main;
        }
    }

    return {
        _id: item._id,
        name: item.name,
        tags: item.tags,
        likesNumber: item.likesFrom.length,
        fields: previewFields,
    };
};
