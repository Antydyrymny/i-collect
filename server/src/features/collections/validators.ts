import { object, array, string } from 'yup';
import { NewCollectionReq, NewItemReq } from '../../types';

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
        author: string().required('Author id is required'),
        format: array().of(
            object({
                fieldName: string().max(255).required('Field name is required'),
                fieldType: string().oneOf(
                    ['boolean', 'number', 'string', 'text', 'date'],
                    'Field type is not recognized'
                ),
            })
        ),
    }),
});

export const validateNewItem = object({
    body: object<NewItemReq>().shape({
        name: string().max(255).required('Item name is required'),
        parentCollection: string().required('Parent collection id is required'),
        tags: array().of(string().max(255, 'Incorrect tag format')),
        format: array().of(
            object({
                fieldName: string().max(255).required('Field name is required'),
                fieldType: string().oneOf(
                    ['boolean', 'number', 'string', 'text', 'date'],
                    'Field type is not recognized'
                ),
            })
        ),
    }),
});
