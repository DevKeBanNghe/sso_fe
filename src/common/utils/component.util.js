import { upperFirst } from 'lodash';

const getPlaceholderDefault = (fieldName) => fieldName.split('_').map(upperFirst).join(' ');

export { getPlaceholderDefault };
