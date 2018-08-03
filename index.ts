import { v4 as uuid } from 'uuid'
import { Answer, Form, Submission, SubmissionMap } from './lib/form-format'
import { getFile, putFile } from './lib/write'

// export types for use elsewhere
export * from './lib/form-format'

const formsListFile = 'forms.json'

function getSubmissionsPath(formUuid: string) {
  return `submissions/${formUuid}.json`
}

function getFormPath(formUuid: string) {
  return `forms/${formUuid}.json`
}

export function getPublishPath(formUuid: string) {
  return `published/${formUuid}.json`
}

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

export async function newFormSubmission(submission: Submission) {
  const submissionsPath = getSubmissionsPath(submission.formUuid)

  const newSubmission: SubmissionMap = {}
  newSubmission[submission.uuid] = submission

  const oldSubmissions = await getFile(submissionsPath) as SubmissionMap || {} as SubmissionMap

  console.debug('Uploading new submissions: ', { ...oldSubmissions, ...newSubmission })
  await putFile(submissionsPath, { ... oldSubmissions, ... newSubmission })
}

export function createDummySubmission(formUuid: string) {
  return {
    answers: [{ questionUuid: '12345', name: 'privacy', value: 'IS GREAT' } as Answer],
    created: new Date(),
    formUuid,
    uuid: uuid(),
  } as Submission
}

export function createForm(form: Form) {
  return Promise.all([
    putFile(getFormPath(form.uuid), form),
    publishForm(form),
    addFormToList(form),
  ])
}

export async function getFormSubmissions(formUuid: string): Promise<SubmissionMap> {
  return await getFile(getSubmissionsPath(formUuid)) as SubmissionMap || {} as SubmissionMap
}

export async function getForm(formUuid: string): Promise<Form | undefined> {
  return await getFile(getFormPath(formUuid)) as Form || undefined
}

export function publishForm(form: Form): Promise<void> {
  return putFile(getPublishPath(form.uuid), form, false)
}

export async function addFormToList(form: Form) {
  const forms = await getForms()
  putFile(formsListFile, [...forms, form])
}

export async function saveForm(form: Form) {
  await putFile(getFormPath(form.uuid), form)
}

async function deleteFormSubmissions(formUuid: string) {
  return await putFile(getSubmissionsPath(formUuid), {})
}

async function removeFormFromList(formUuid: string) {
  const forms = await getForms()
  putFile(formsListFile, forms.filter((f) => f.uuid !== formUuid))
}

export async function unpublishForm(formUuid: string) {
  return await putFile(getPublishPath(formUuid), {})
}

export async function deleteForm(formUuid: string) {
  await unpublishForm(formUuid)
  await deleteFormSubmissions(formUuid)
  await removeFormFromList(formUuid)
  await putFile(getFormPath(formUuid), {})
}

export async function getForms(): Promise<Array<Partial<Form>>> {
  const forms = await getFormsFile() as Array<Partial<Form>>
  if (!forms) {
    await initForms()
  }
  return forms || [] as Array<Partial<Form>>
}

async function getFormsFile() {
  return await getFile(formsListFile)
}

async function initForms() {
  return await putFile(formsListFile, [])
}
