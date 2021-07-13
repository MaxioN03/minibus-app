import {BASE_URL} from './constants';

//For POST method must be headers 'Content-Type': 'application/json'
export const makeRequest = (url: string, options?: any) => {
    let requestUrl: URL = new URL(url, BASE_URL);
    return fetch(requestUrl.toString(), options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw response.json();
            }
        })
        .then(response => response)
        .catch(err => {
            return err.then((errorResult: any) => {
                throw errorResult.error
            })
        });
};