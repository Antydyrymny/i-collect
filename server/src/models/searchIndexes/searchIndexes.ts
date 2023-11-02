import { request } from 'urllib';
import findIndexByName, {
    SEARCH_INDEX_API_URL,
    DIGEST_AUTH,
    MONGODB_DATABASE,
} from './findIndexByName';
import { Indexes, Models } from '../../types';

export async function upsertAutocompleteIndex() {
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
                // https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/#index-definition
                mappings: {
                    dynamic: false,
                    fields: {
                        name: [
                            {
                                foldDiacritics: false,
                                maxGrams: 7,
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
