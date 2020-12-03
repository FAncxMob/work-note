import * as config from './config';
import * as Show from './Show';
import * as Tag from './Tag';

export * from './config';
export * from './Show';
export * from './Tag';

export default {
  ...config,
  ...Show,
  ...Tag,
};
