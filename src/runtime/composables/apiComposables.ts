
    import {type Ref, unref, toRaw } from 'vue'
    export type Endpoint = "test1" | "index.get" | "index.post";
    export type APIParams<T> = T extends "api.test1" ? { id: number }:T extends "theme.index.get" ? { }:T extends "theme.index.post" ? { name: string }: never;
    export type APIOutput<T> = T extends "api.test1" ? { service: string, date: string, }:T extends "theme.index.get" ? { test: string, }:T extends "theme.index.post" ? { theme: string, }: never;

    export function api() {
      return {
        
        // @ts-expect-error
        test1<T = 'api.test1'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(`/api/test1`, 'get', params, options) as AsyncData<APIOutput<T>, Error>
        }
      ,
    theme: {
      
        // @ts-expect-error
        getIndex<T = 'theme.index.get'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(`/api/theme/`, 'get', params, options) as AsyncData<APIOutput<T>, Error>
        }
      ,
        // @ts-expect-error
        postIndex<T = 'theme.index.post'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(`/api/theme/`, 'post', params, options) as AsyncData<APIOutput<T>, Error>
        }
      
    }
  
      }
    }

    export function useExtendedFetch<T>(
      url: string,
      method: string = 'get',
      params?: Ref<APIParams<T>> | APIParams<T>,
      // @ts-expect-error
      options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }
    ) {
      const isHasArray = Object.values(unref(params) || {}).some(value => Array.isArray(value))
      // @ts-expect-error
      return useFetch<APIOutput<T>>(url, {
        method,
        [['get', 'delete'].includes(method) ? 'query' : 'body']: isHasArray
          ? Object.fromEntries(Object.entries(unref(params) || {}).map(([k, v]) => [Array.isArray(v) ? `${k}[]` : k, toRaw(v)]))
          : params,
        lazy: true,
        getCachedData: options?.withCache === true ? (key, nuxtApp) => {
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        } : undefined,
        default: () => [],
        ...options }
      // @ts-expect-error
      )  as AsyncData<APIOutput<T>, Error>
    }
  