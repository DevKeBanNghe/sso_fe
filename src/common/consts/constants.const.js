import { convertToListOptions } from '../utils/helpers.util';

export const STATUS_OPTIONS = convertToListOptions([{ all: 2 }, { active: 1 }, { hidden: 0 }]);

export const REVIEW_STATUS_OPTIONS = convertToListOptions([
  { all: 3 },
  { accepted: 1 },
  { reviewing: 2 },
  { rejected: 0 },
]);

export const GENDER_OPTIONS = convertToListOptions([{ all: 2 }, { male: 1 }, { female: 0 }]);

export const DEFAULT_PAGINATION = {
  page: 1,
  itemPerPage: 4,
};

export const SELECT_LIMIT_OPTIONS = 6;
