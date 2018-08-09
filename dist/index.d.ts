import { Form, Submission, SubmissionMap } from './lib/form-format';
export * from './lib/form-format';
export declare function getPublishPath(formUuid: string): string;
export declare function newFormSubmission(submission: Submission): Promise<void>;
export declare function createDummySubmission(formUuid: string): Submission;
export declare function createForm(form: Form): Promise<[void, void, void]>;
export declare function getFormSubmissions(formUuid: string): Promise<SubmissionMap>;
export declare function getForm(formUuid: string): Promise<Form | undefined>;
export declare function publishForm(form: Form): Promise<void>;
export declare function addFormToList(form: Form): Promise<void>;
export declare function saveForm(form: Form): Promise<void>;
export declare function unpublishForm(formUuid: string): Promise<void>;
export declare function deleteForm(formUuid: string): Promise<void>;
export declare function getForms(): Promise<Array<Partial<Form>>>;