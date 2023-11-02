import { upsertAutocompleteIndex } from './searchIndexes';

export const upsertAllSearchIndexes = async () => {
    await upsertAutocompleteIndex();
};
