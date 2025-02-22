import { convertToListOptions } from '../utils/helpers.util';

const STATUS_OPTIONS = convertToListOptions([{ all: 2 }, { active: 1 }, { hidden: 0 }]);

const REVIEW_STATUS_OPTIONS = convertToListOptions([{ all: 3 }, { accepted: 1 }, { reviewing: 2 }, { rejected: 0 }]);

const GENDER_OPTIONS = convertToListOptions([{ all: 2 }, { male: 1 }, { female: 0 }]);

const DEFAULT_PAGINATION = {
  page: 1,
  itemPerPage: 10,
};

const SELECT_LIMIT_OPTIONS = 6;

const LOADING_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};

const ACTIVATE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
};

const PERSONAL_BRAND = 'Dev Kể Bạn Nghe';

export {
  STATUS_OPTIONS,
  REVIEW_STATUS_OPTIONS,
  GENDER_OPTIONS,
  DEFAULT_PAGINATION,
  SELECT_LIMIT_OPTIONS,
  LOADING_STATUS,
  ACTIVATE_STATUS,
  PERSONAL_BRAND,
};
