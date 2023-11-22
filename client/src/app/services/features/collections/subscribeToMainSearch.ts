import { ApiBuilder, MainSearchRes, MainSearchToServer } from '../../../../types';
import { getMainSearchSocket } from '../../getSocket';

export const mainSearch = (builder: ApiBuilder) =>
    builder.query<MainSearchRes, string>({
        queryFn: (query) => {
            const mainSearchSocket = getMainSearchSocket();

            return query === ''
                ? { data: [] }
                : new Promise((resolve) => {
                      mainSearchSocket.emit(
                          MainSearchToServer.Searching,
                          query,
                          (foundItems) => {
                              resolve({
                                  data: foundItems,
                              });
                          }
                      );
                  });
        },
    });
