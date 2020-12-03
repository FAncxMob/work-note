import UFF from '@/utils/UFF';
import config from '@/utils/config';
import User from './user';

UFF.init(config.UFFUrl);

window.User = new User();

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      const { error = {} } = e;
      console.error(error.message);
    },
  },
};
