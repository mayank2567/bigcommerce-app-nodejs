export interface FormData {
    description: string;
    isVisible: boolean;
    name: string;
    price: number;
    type: string;
    metadescriptions: string;
    metakeywords: string;
    searchkeywords: string;
    page_type: string;
}

export interface TableItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface ListItem extends FormData {
    id: number;
}

export interface StringKeyValue {
    [key: string]: string;
}
