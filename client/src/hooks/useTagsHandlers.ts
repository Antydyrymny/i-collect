import { useCallback, useState } from 'react';

/**
 * A set of functions for tag management
 * @param defaultTags an array of unique starting tags, defaults to empty array
 * @returns
 * @tags state variable, an array of current tags
 * @addTag adds a tag from string
 * @removeTag removes tag by name
 * @submitCurTag adds a tag by submitting a form
 */
export const useTagsHandlers = (defaultTags: string[] = []) => {
    const [tags, setTags] = useState<string[]>(defaultTags);
    const addTag = useCallback(
        (tag: string) => () => {
            if (tags.includes(tag)) return;
            setTags([...tags, tag]);
        },
        [tags]
    );
    const removeTag = useCallback(
        (tag: string) => () => {
            setTags((prevTags) => prevTags.filter((prevTag) => prevTag !== tag));
        },
        []
    );
    const submitCurTag = useCallback(
        (tag: string) => (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!tag) return;
            setTags((prevTags) => [...prevTags, tag]);
        },
        []
    );
    return { tags, addTag, removeTag, submitCurTag };
};
