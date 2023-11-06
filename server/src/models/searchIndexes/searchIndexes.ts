import { request } from 'urllib';
import findIndexByName, {
    SEARCH_INDEX_API_URL,
    DIGEST_AUTH,
    MONGODB_DATABASE,
} from './findIndexByName';
import { Indexes, Models } from '../../types';

export async function upsertTagAutocompleteIndex() {
    const tagAutocompleteIndex = await findIndexByName(
        Indexes.TagAutoComplete,
        Models.Tag
    );

    if (!tagAutocompleteIndex) {
        await request(SEARCH_INDEX_API_URL, {
            data: {
                name: Indexes.TagAutoComplete,
                database: MONGODB_DATABASE,
                collectionName: Models.Tag,
                mappings: {
                    dynamic: false,
                    fields: {
                        name: [
                            {
                                foldDiacritics: false,
                                maxGrams: 7,
                                minGrams: 2,
                                tokenization: 'nGram',
                                type: 'autocomplete',
                            },
                        ],
                    },
                },
            },
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            digestAuth: DIGEST_AUTH,
        });
    }
}

export async function upsertItemFullTextSearchIndex() {
    const itemFullTextSearchIndex = await findIndexByName(
        Indexes.ItemFullTextSearch,
        Models.Item
    );

    if (!itemFullTextSearchIndex) {
        await request(SEARCH_INDEX_API_URL, {
            data: {
                name: Indexes.ItemFullTextSearch,
                database: MONGODB_DATABASE,
                collectionName: Models.Item,
                mappings: {
                    dynamic: false,
                    fields: {
                        name: {
                            type: 'string',
                        },
                        tags: {
                            type: 'string',
                        },
                        stringFields: {
                            type: 'document',
                            dynamic: true,
                        },
                        textFields: {
                            type: 'document',
                            dynamic: true,
                        },
                    },
                },
            },
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            digestAuth: DIGEST_AUTH,
        });
    }
}

export async function upsertCommentFullTextSearchIndex() {
    const commentFullTextSearchIndex = await findIndexByName(
        Indexes.CommentFullTextSearch,
        Models.Comment
    );

    if (!commentFullTextSearchIndex) {
        await request(SEARCH_INDEX_API_URL, {
            data: {
                name: Indexes.CommentFullTextSearch,
                database: MONGODB_DATABASE,
                collectionName: Models.Comment,
                mappings: {
                    dynamic: false,
                    fields: {
                        content: {
                            type: 'string',
                        },
                    },
                },
            },
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            digestAuth: DIGEST_AUTH,
        });
    }
}

export async function upsertUserAutocompleteIndex() {
    const userAutocompleteIndex = await findIndexByName(
        Indexes.UserAutocomplete,
        Models.User
    );

    if (!userAutocompleteIndex) {
        await request(SEARCH_INDEX_API_URL, {
            data: {
                name: Indexes.UserAutocomplete,
                database: MONGODB_DATABASE,
                collectionName: Models.User,
                mappings: {
                    dynamic: false,
                    fields: {
                        name: [
                            {
                                foldDiacritics: false,
                                maxGrams: 12,
                                minGrams: 3,
                                tokenization: 'edgeGram',
                                type: 'autocomplete',
                            },
                        ],
                    },
                },
            },
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            digestAuth: DIGEST_AUTH,
        });
    }
}
