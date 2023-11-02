export type Item = {
    name: string;
    parentCollection: string;
    tags: string[];
    comments: string[];
    likesFrom: string[];
    booleanFields: Map<string, boolean>;
    numberFields: Map<string, number>;
    stringFields: Map<string, string>;
    textFields: Map<string, string>;
    dateFields: Map<string, Date>;
};
