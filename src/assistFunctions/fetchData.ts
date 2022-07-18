interface FetchOptions {
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
  mode?: 'same-origin' | 'no-cors' | 'cors' | 'navigate';
  output?: 'json' | 'text';
  cache?: 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  body?: string;
  redirect?: 'follow' | 'manual' | 'error';
  referrerPolicy?: 'no-referrer' | 'client';
  credentials?: 'omit' | 'same-origin' | 'include';
  headers?: {
    Accept?: 'application/json' | 'text/html' | 'multipart/form-data' | 'text/plain';
    'Content-type'?:
    | 'application/json'
    | 'application/json;charset=UTF-8'
    | 'text/html'
    | 'multipart/form-data'
    | 'text/plain'
    | 'application/x-www-form-urlencoded';
  };
}

export type CategoryDataType = {
  categoryId: string;
  categoryName: string;
  categoryImageLink: string;
  cards: CardInterface[];
};

export interface CardInterface {
  cardId: string;
  cardImageLink: string;
  cardWordInEnglish: string;
  cardWordInPolish: string;
}

async function fetchWordsData(
  url: string,
  { method = 'GET', mode = 'cors', output = 'json' }: FetchOptions = {},
): Promise<CategoryDataType[]> {
  try {
    const response = await fetch(url, { method, mode });
    if (response.ok) {
      const data = output === 'json' ? await response.json() : await response.text();
      return data;
    } else {
      return await Promise.reject(new Error(`Response status is ${response.status}`));
    }
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error');
  }
}

export default fetchWordsData;
