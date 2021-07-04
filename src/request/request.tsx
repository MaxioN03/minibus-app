import { BASE_URL } from './constants';

export const makeRequest = (url: string, options?: any) => {
    let requestUrl: URL = new URL(url, BASE_URL);
    return fetch(requestUrl.toString(), options)
        .then(response => response.json())
        .then(response => response)
};