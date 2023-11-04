import { object, array, string, mixed } from 'yup';
import {
    DeleteCollectionReq,
    ItemReqFormatField,
    NewCollectionReq,
    ItemReq,
    UpdateCollectionReq,
    DeleteItemReq,
    ToggleLikeItemReq,
    NewCommentReq,
    EditCommentReq,
} from '../../types';

const URL =
    /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i;

export const validateNewCollection = object({
    body: object<NewCollectionReq>().shape({
        name: string().max(255).required('Collection name is required'),
        description: string(),
        theme: string().oneOf(
            [
                'Books',
                'Signs',
                'Films',
                'Stamps',
                'Coins',
                'Comics',
                'Cards',
                'Cars',
                'Art',
                'Other',
            ],
            'Theme is not recognized'
        ),
        image: string().matches(URL, 'Enter a valid url'),
        format: array()
            .of(
                object({
                    fieldName: string()
                        .max(255, 'Field name is too long')
                        .required('Field name is required'),
                    fieldType: string().oneOf(
                        ['boolean', 'number', 'string', 'text', 'date'],
                        'Field type is not recognized'
                    ),
                })
            )
            .test(
                'formatLength',
                'Collection should not hold more than 15 additional fields',
                (array) => array.length < 16
            )
            .test(
                'upTo3TypeFields',
                `Collection's additional fields should not have more than 3 fields of each of allowed types`,
                (array) => {
                    const seenTypes = new Map<string, number>();
                    for (const { fieldType: t } of array) {
                        seenTypes.set(t, seenTypes.has(t) ? 1 : seenTypes.get(t) + 1);
                        if (seenTypes.get(t) > 3) return false;
                    }
                    return true;
                }
            ),
    }),
});

export const validateUpdateCollection = object({
    body: object<UpdateCollectionReq>().shape({
        _id: string().max(255).required('Collection id is required'),
        name: string().max(255),
        description: string(),
        theme: string().oneOf(
            [
                'Books',
                'Signs',
                'Films',
                'Stamps',
                'Coins',
                'Comics',
                'Cards',
                'Cars',
                'Art',
                'Other',
            ],
            'Theme is not recognized'
        ),
        image: string().matches(URL, 'Enter a valid url'),
    }),
});

export const validateDeleteCollection = object({
    body: object<DeleteCollectionReq>().shape({
        _id: string().max(255).required('Collection id is required'),
    }),
});

const validateItem = object({
    body: object<ItemReq>().shape({
        tags: array()
            .of(string().max(255, 'Incorrect tag format'))
            .test('unique', 'Only unique tags allowed', (array) =>
                array ? array.length === new Set(array)?.size : true
            ),
        fields: array()
            .of(
                object<ItemReqFormatField>()
                    .shape({
                        fieldName: string()
                            .max(255, 'Field name is too long')
                            .required('Field name is required'),
                        fieldValue: mixed().required('Field value is required'),
                        fieldType: string()
                            .oneOf(
                                ['boolean', 'number', 'string', 'text', 'date'],
                                'Field type is not recognized'
                            )
                            .required('Field type is required'),
                    })
                    .test(
                        'valueConformsToType',
                        `Generic field's value does not conform to it type`,
                        ({ fieldType: type, fieldValue: val }) => {
                            if (type === 'date')
                                return !isNaN(new Date(val as string).getTime());
                            else if (type === 'text') return typeof val === 'string';
                            else if (type === 'string')
                                return typeof val === 'string' && val.length < 256;
                            else return typeof val === type;
                        }
                    )
            )
            .test(
                'genericFieldsLength',
                'Generic fields array should not hold more than 15 elements',
                (array) => array.length < 16
            ),
    }),
});

export const validateNewItem = validateItem.shape({
    body: object().shape({
        name: string().max(255).required('Item name is required'),
        parentCollectionId: string().required('Parent collection id is required'),
    }),
});

export const validateUpdateItem = validateItem.shape({
    body: object().shape({
        _id: string().max(255).required('Item id is required'),
        name: string().max(255),
    }),
});

export const validateDeleteItem = object({
    body: object<DeleteItemReq>().shape({
        _id: string().max(255).required('Item id is required'),
    }),
});

export const validateToggleLikeReq = object({
    body: object<ToggleLikeItemReq>().shape({
        _id: string().max(255).required('Item id is required'),
        action: string()
            .oneOf(['like', 'dislike'], 'Action is not recognized')
            .required('Action is required'),
    }),
});

export const validateNewComment = object({
    body: object<NewCommentReq>().shape({
        toItem: string().max(255).required('Item id is required'),
        content: string().required('Comment content is required'),
    }),
});

export const validateEditComment = object({
    body: object<EditCommentReq>().shape({
        _id: string().max(255).required('Comment id is required'),
        content: string().required('Comment content is required'),
    }),
});

export const validateDeleteComment = object({
    body: object<EditCommentReq>().shape({
        _id: string().max(255).required('Comment id is required'),
    }),
});
