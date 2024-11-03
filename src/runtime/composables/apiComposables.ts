
    import { useFetch, type AsyncData, type UseFetchOptions } from 'nuxt/app'
    import {type Ref, unref, toRaw } from 'vue'
    export type Endpoint = "test1" | "index.get" | "index.post";
    export type APIParams<T> = T extends "api.test1" ? { id: number }:T extends "theme.index.get" ? {}:T extends "theme.index.post" ? { name: string }: never;
    export type APIOutput<T> = T extends "api.test1" ? { a: PrismaJson.DistrictInfo; b: PrismaJson.BankInfo; }:T extends "theme.index.get" ? Record<string, Record<string, string>>:T extends "theme.index.post" ? { theme: string; }: never;
    export const defaults = {'api.test1': {a: {name: '',subItem: []},b: {name: '',city: '',address: '',mfo: '',edrpou: ''}},'theme.index.get': {},'theme.index.post': {theme: ''}};

    const dfBuilder = (n: string, d: unknown) => () => Array.isArray(defaults[n])
      ? d || defaults[n]
      : typeof defaults[n] === 'object'
        ? { ...defaults[n], ...d }
        : d || defaults[n]

    export function api() {
      return {
        
        test1<T = 'api.test1'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { defaultData?: APIOutput<T>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(`/api/test1`, 'get', params, {...options, default: dfBuilder('api.test1', options?.defaultData) }) as AsyncData<APIOutput<T>, Error>
        }
      ,
    theme: {
      
        getData<T = 'theme.index.get'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { defaultData?: APIOutput<T>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(`/api/theme/`, 'get', params, {...options, default: dfBuilder('theme.index.get', options?.defaultData) }) as AsyncData<APIOutput<T>, Error>
        }
      ,
        postData<T = 'theme.index.post'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { defaultData?: APIOutput<T>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(`/api/theme/`, 'post', params, {...options, default: dfBuilder('theme.index.post', options?.defaultData) }) as AsyncData<APIOutput<T>, Error>
        }
      
    }
  
      }
    }

    export function useExtendedFetch<T>(
      url: string,
      method: string = 'get',
      params?: Ref<APIParams<T>> | APIParams<T>,
      options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T>, withCache?: boolean | number }
    ) {
      const isHasArray = Object.values(unref(params) || {}).some(value => Array.isArray(value))
      // @ts-expect-error
      return useFetch<APIOutput<T>>(url, {
        method,
        [['get', 'delete'].includes(method) ? 'query' : 'body']: isHasArray
          ? Object.fromEntries(Object.entries(unref(params) || {}).map(([k, v]) => [Array.isArray(v) ? `${k}[]` : k, toRaw(v)]))
          : params,
        lazy: true,
        getCachedData: options?.withCache === true ? (key: string | number, nuxtApp: { payload: { data: { [x: string]: any; }; }; static: { data: { [x: string]: any; }; }; }) => {
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        } : undefined,
        default: () => [],
        ...options }
      )  as AsyncData<APIOutput<T>, Error>
    }
  