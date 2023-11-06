import {
    // upsertUserAutocompleteIndex,
    upsertTagAutocompleteIndex,
    upsertItemFullTextSearchIndex,
    upsertCommentFullTextSearchIndex,
} from './searchIndexes';

export const upsertAllSearchIndexes = async () => {
    await upsertTagAutocompleteIndex();
    await upsertItemFullTextSearchIndex();
    await upsertCommentFullTextSearchIndex();
    // await upsertUserAutocompleteIndex(); // mongodb free tier limits the number of indexes to 3
};
