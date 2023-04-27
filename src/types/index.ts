
export type Item = {
    po_description: string,
    amount: string
}
export type FormData = {
    append(name: string, value: string | Blob, fileName?: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string | Blob, fileName?: string): void;
    forEach(callback: (value: string, key: string, parent: FormData) => void): void;
}           

export type Details = {
    po_id: string,
    poname: string,
    projectName: string,
    date: string,
    items: Item[],
    filename: string,
    filePath:string
}
export type Data = {
    details: Details,
    filename: FormData
}

export type UpdateDetails={
  date: string,
  description: string,
  amount: string,
  raisedAmount?: string,
  dmrNo?: string
    
}