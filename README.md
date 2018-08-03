# dappform-forms-api
Standard shareable module to work with dappforms

## Installation
```sh
npm install dappform-forms-api --save
yarn add dappform-forms-api
```

## Usage

### Javascript

```javascript
const formsApi = require('dappform-forms-api');
console.log(formsApi.getForms('Boy'));
```
```sh
Output should be [ ... list of form objects ]
```

### TypeScript
```typescript
import { getForms } from 'dappform-forms-api'
console.log(getForms())
```
```sh
Output should be [ ... list of form objects ]
```
