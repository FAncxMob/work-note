import types from '../../data/types';

const NAME = 'BT';
const CNAME = '标题';

export const config = {
  name: NAME,
  cname: CNAME,
  tag: {
    name: NAME,
    type: types.componentTag,
  },
  show: {
    name: NAME,
    type: types.componentShow,
  },
};
