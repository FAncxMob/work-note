import { useDrag } from 'react-dnd';

import types from '../data/types';

const NAME = 'Placeholder';

export const config = {
  name: NAME,
  show: {
    name: NAME,
    type: types.componentShow,
  },
};

export const Placeholder = ({ index }) => {
  const [, drag] = useDrag({
    item: config.show,
    begin(monitor) {
      // console.log('拖拽开始', monitor);
      return {
        index,
      };
    },
    end(current, monitor) {
      // console.log('拖拽结束', monitor);
    },
  });

  return (
    <div className="app-card-lv2 bgc-primary" ref={drag}>
      移动到这里
    </div>
  );
};
