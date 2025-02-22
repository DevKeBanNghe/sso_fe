import { isUndefined } from 'lodash';

const redirectTo = (path) => (window.location = path);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const convertUndefinedToNull = (values = {}) =>
  Object.entries(values).reduce((acc, [key, value]) => ({ ...acc, [key]: isUndefined(value) ? null : value }), {});

export { redirectTo, delay, convertUndefinedToNull };
