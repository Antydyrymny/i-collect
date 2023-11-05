import {
    upsertUserAutocompleteIndex,
    upsertTagAutocompleteIndex,
    upsertItemFuzzySearchIndex,
} from './searchIndexes';

export const upsertAllSearchIndexes = async () => {
    await upsertUserAutocompleteIndex();
    await upsertTagAutocompleteIndex();
    await upsertItemFuzzySearchIndex();
};
