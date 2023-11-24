import { object, array, string, mixed, boolean } from 'yup';
import {
    DeleteCollectionReq,
    ItemFormatField,
    NewCollectionReq,
    ItemReq,
    UpdateCollectionReq,
    DeleteItemReq,
    ToggleLikeItemReq,
    NewCommentReq,
    EditCommentReq,
    CollectionsPreviewQuery,
    GetCollectionQuery,
    GetCollectionItemsQuery,
    GetItemQuery,
    GetItemCommentsQuery,
    GetUserCollectionQuery,
    FindCollectionItemQuery,
    FormatFieldUpdate,
} from '../../types';

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
        format: array().of(
            object({
                fieldName: string()
                    .max(255, 'Field name is too long')
                    .required('Field name is required'),
                fieldType: string()
                    .oneOf(
                        ['boolean', 'number', 'string', 'text', 'date'],
                        'Field type is not recognized'
                    )
                    .required('Field type is required'),
            })
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
        deleteImage: boolean().isTrue(),
        format: array().of(
            object<FormatFieldUpdate>().shape({
                action: string()
                    .oneOf(['add', 'rename', 'delete'], 'Action is not recognized')
                    .required('Action is required'),

                fieldName: string()
                    .max(255, 'Field name is too long')
                    .required('Field name is required'),
                fieldType: string()
                    .oneOf(
                        ['boolean', 'number', 'string', 'text', 'date'],
                        'Field type is not recognized'
                    )
                    .required('Field type is required'),
                newName: string().max(255, 'Field name is too long'),
            })
        ),
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
                object<ItemFormatField>()
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

export const validateUserCollections = object({
    query: object<CollectionsPreviewQuery>().shape({
        ownerId: string().max(255),
        page: string().max(255),
        limit: string().max(255),
    }),
});

export const validateGetCollection = object({
    query: object<GetCollectionQuery>().shape({
        _id: string().max(255).required('Collection id is required'),
    }),
});

export const validateGetUserCollection = object({
    query: object<GetUserCollectionQuery>().shape({
        ownerId: string().max(255),
        query: string().max(255).required('Collection query is required'),
    }),
});

export const validateGetCollectionItems = object({
    query: object<GetCollectionItemsQuery>().shape({
        collectionId: string().max(255).required(),
        page: string().max(255),
        limit: string().max(255),
    }),
});

export const validateGetItem = object({
    query: object<GetItemQuery>().shape({
        _id: string().max(255).required('Item id is required'),
        userId: string().max(255),
    }),
});

export const validateGetItemComments = object({
    query: object<GetItemCommentsQuery>().shape({
        itemId: string().max(255).required('Item id is required'),
        page: string().max(255),
        limit: string().max(255),
    }),
});

export const validateFindCollectionItems = object({
    query: object<FindCollectionItemQuery>().shape({
        collectionId: string().max(255).required('Collection id is required'),
        query: string().max(255).required('Query is required'),
    }),
});
