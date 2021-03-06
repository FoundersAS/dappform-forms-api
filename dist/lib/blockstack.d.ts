export declare function putFile(path: string, contents: Object, encrypt?: boolean): Promise<void>;
export declare function getFile(path: string): Promise<Object | Boolean>;
export declare function getPublicFormURL(formUuid: string, authorName: string, appOrigin: string): Promise<any>;
