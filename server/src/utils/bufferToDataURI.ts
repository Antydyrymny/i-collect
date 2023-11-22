import DataURIParser from 'datauri/parser';
import { DataURI } from 'datauri/types';

const parser = new DataURIParser();

export const bufferToDataURI = (fileFormat: string, buffer: DataURI.Input) =>
    parser.format(fileFormat, buffer);
