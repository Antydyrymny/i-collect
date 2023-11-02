import { request } from 'urllib';
import dotenv from 'dotenv';
import { Models } from '../../types';

dotenv.config();

const ATLAS_API_BASE_URL = 'https://cloud.mongodb.com/api/atlas/v1.0';
const PROJECT_ID = process.env.MONGODB_PROJECT_ID;
const CLUSTER_NAME = process.env.MONGODB_CLUSTER;
const CLUSTER_API_URL = `${ATLAS_API_BASE_URL}/groups/${PROJECT_ID}/clusters/${CLUSTER_NAME}`;
export const SEARCH_INDEX_API_URL = `${CLUSTER_API_URL}/fts/indexes`;

const ATLAS_API_PUBLIC_KEY = process.env.ATLAS_API_PUBLIC_KEY;
const ATLAS_API_PRIVATE_KEY = process.env.ATLAS_API_PRIVATE_KEY;
export const DIGEST_AUTH = `${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`;

export const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

export default async function findIndexByName(indexName: string, collectionName: Models) {
    const allIndexesResponse = await request(
        `${SEARCH_INDEX_API_URL}/${MONGODB_DATABASE}/${collectionName}`,
        {
            dataType: 'json',
            contentType: 'application/json',
            method: 'GET',
            digestAuth: DIGEST_AUTH,
        }
    );

    return (allIndexesResponse.data as { name: string }[]).find(
        (i) => i.name === indexName
    );
}
