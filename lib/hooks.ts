import useSWR from 'swr';
import { useSession } from '../context/session';
import { ErrorProps, ListItem, Order, QueryParams, ShippingAndProductsInfo,User } from '../types';

async function fetcher(url: string, query: string) {
    const res = await fetch(`${url}?${query}`);

    // If the status code is not in the range 200-299, throw an error
    if (!res.ok) {
        const { message } = await res.json();
        const error: ErrorProps = new Error(message || 'An error occurred while fetching the data.');
        error.status = res.status; // e.g. 500
        throw error;
    }

    return res.json();
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useProducts() {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(context ? ['/api/products', params] : null, fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        error,
    };
}

export function useProductList(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(context ? ['/api/products/list', params] : null, fetcher);

    return {
        list: data?.data,
        meta: data?.meta,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

export function useProductInfo(pid: number, list?:ListItem[]) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    let product: ListItem; 

    if (list?.length) { 
       product = list.find(item => item.id === pid);
    }

    // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!product && context ? [`/api/products/${pid}`, params] : null, fetcher);
    return {
        product: product ?? data,
        isLoading: product ? false : (!data && !error),
        error,
    };
}

export const useOrder = (orderId: number) => {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    const shouldFetch = context && orderId !== undefined;

    // Conditionally fetch orderId is defined
    const { data, error } = useSWR<Order, ErrorProps>(shouldFetch ? [`/api/orders/${orderId}`, params] : null, fetcher);

    return {
        order: data,
        isLoading: !data && !error,
        error,
    };
}

export const useShippingAndProductsInfo = (orderId: number) => {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    const shouldFetch = context && orderId !== undefined;

    // Shipping addresses and products are not included in the order data and need to be fetched separately
    const { data, error } = useSWR<ShippingAndProductsInfo, ErrorProps>(
        shouldFetch ? [`/api/orders/${orderId}/shipping_products`, params] : null, fetcher
    );

    return {
        order: data,
        isLoading: !data && !error,
        error,
    };
}

export function useBrands() {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(context ? ['/api/brands', params] : null, fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        error,
    };
}

export function useBrandList(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(context ? ['/api/brands/list', params] : null, fetcher);

    return {
        list: data?.data,
        meta: data?.meta,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

export function useBrandInfo(pid: number, list?:ListItem[]) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    let brand: ListItem; 

    if (list?.length) { 
       brand = list.find(item => item.id === pid);
    }

    // Conditionally fetch brand if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!brand && context ? [`/api/brands/${pid}`, params] : null, fetcher);
    return {
        brand: brand ?? data,
        isLoading: brand ? false : (!data && !error),
        error,
    };
}

export function usecategories() {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(context ? ['/api/categories', params] : null, fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        error,
    };
}

export function usecategoryList(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(context ? ['/api/categories/list', params] : null, fetcher);

    return {
        list: data?.data,
        meta: data?.meta,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

export function usecategoryInfo(pid: number, list?:ListItem[]) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    let category: ListItem; 

    if (list?.length) { 
       category = list.find(item => item.id === pid);
    }

    // Conditionally fetch category if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!category && context ? [`/api/categories/${pid}`, params] : null, fetcher);
    return {
        category: category ?? data,
        isLoading: category ? false : (!data && !error),
        error,
    };
}

export function getUser() {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    let user: User;
    const { data, error } = useSWR(context ? [`/api/user`, params] : null, fetcher);
    // localStorage.setItem('user', JSON.stringify(data));
    user = data;
    return user;
}


export function setUser(user: User) {
    // console.log(`user: in setUser functrii ${JSON.stringify(user)}`);
    if(!user?.email) return null;
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    const { data, error } = useSWR(context ? [`/api/user/${user.email}`, user] : null, fetcher);
    return data;
}

