"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const write_1 = require("./lib/write");
const formsListFile = 'forms.json';
function getSubmissionsPath(formUuid) {
    return `submissions/${formUuid}.json`;
}
function getFormPath(formUuid) {
    return `forms/${formUuid}.json`;
}
function getPublishPath(formUuid) {
    return `published/${formUuid}.json`;
}
exports.getPublishPath = getPublishPath;
// function sortSubmissions(submissions: Submission[]): FormSubmissionMap {
//   return submissions.reduce((acc: FormSubmissionMap, cur: Submission) => {
//     acc[cur.formUuid] = acc[cur.formUuid] || {} as SubmissionMap
//     acc[cur.formUuid][cur.uuid] = cur
//     return acc
//   }, {} as FormSubmissionMap)
// }
// // TODO: make the request concurrent for performance if needed
// async function updateFormSubmissions(forms: FormSubmissionMap) {
//   for (const formUuid in forms) {
//     if (forms.hasOwnProperty(formUuid)) {
//       const newSubmissions = forms[formUuid]
//       const submissionsPath = getSubmissionsPath(formUuid)
//       const oldSubmissions = await getFile(submissionsPath) as SubmissionMap || {} as SubmissionMap
//       console.debug(`form: ${formUuid} new submissions:`, newSubmissions)
//       console.debug(`form: ${formUuid} old submissions:`, oldSubmissions)
//       console.debug(`form: ${formUuid} old + new: `, { ...oldSubmissions, ...newSubmissions })
//       await putFile(submissionsPath, { ... oldSubmissions, ... newSubmissions })
//     }
//   }
// }
// export async function updateSubmissionsFromBench(submissions: Submission[]) {
//   return updateFormSubmissions(sortSubmissions(submissions))
// }
async function newFormSubmission(submission) {
    const submissionsPath = getSubmissionsPath(submission.formUuid);
    const newSubmission = {};
    newSubmission[submission.uuid] = submission;
    const oldSubmissions = await write_1.getFile(submissionsPath) || {};
    console.debug('Uploading new submissions: ', Object.assign({}, oldSubmissions, newSubmission));
    await write_1.putFile(submissionsPath, Object.assign({}, oldSubmissions, newSubmission));
}
exports.newFormSubmission = newFormSubmission;
function createDummySubmission(formUuid) {
    return {
        answers: [{ questionUuid: '12345', name: 'privacy', value: 'IS GREAT' }],
        created: new Date(),
        formUuid,
        uuid: uuid_1.v4(),
    };
}
exports.createDummySubmission = createDummySubmission;
function createForm(form) {
    return Promise.all([
        write_1.putFile(getFormPath(form.uuid), form),
        publishForm(form),
        addFormToList(form),
    ]);
}
exports.createForm = createForm;
async function getFormSubmissions(formUuid) {
    return await write_1.getFile(getSubmissionsPath(formUuid)) || {};
}
exports.getFormSubmissions = getFormSubmissions;
async function getForm(formUuid) {
    return await write_1.getFile(getFormPath(formUuid)) || undefined;
}
exports.getForm = getForm;
function publishForm(form) {
    return write_1.putFile(getPublishPath(form.uuid), form, false);
}
exports.publishForm = publishForm;
async function addFormToList(form) {
    const forms = await getForms();
    write_1.putFile(formsListFile, [...forms, form]);
}
exports.addFormToList = addFormToList;
async function saveForm(form) {
    await write_1.putFile(getFormPath(form.uuid), form);
}
exports.saveForm = saveForm;
async function deleteFormSubmissions(formUuid) {
    return await write_1.putFile(getSubmissionsPath(formUuid), {});
}
async function removeFormFromList(formUuid) {
    const forms = await getForms();
    write_1.putFile(formsListFile, forms.filter((f) => f.uuid !== formUuid));
}
async function unpublishForm(formUuid) {
    return await write_1.putFile(getPublishPath(formUuid), {});
}
exports.unpublishForm = unpublishForm;
async function deleteForm(formUuid) {
    await unpublishForm(formUuid);
    await deleteFormSubmissions(formUuid);
    await removeFormFromList(formUuid);
    await write_1.putFile(getFormPath(formUuid), {});
}
exports.deleteForm = deleteForm;
async function getForms() {
    const forms = await getFormsFile();
    if (!forms) {
        await initForms();
    }
    return forms || [];
}
exports.getForms = getForms;
async function getFormsFile() {
    return await write_1.getFile(formsListFile);
}
async function initForms() {
    return await write_1.putFile(formsListFile, []);
}
//# sourceMappingURL=index.js.map