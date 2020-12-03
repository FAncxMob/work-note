import { useDrag } from 'react-dnd';

import { createComponent } from '../../common';
import { config } from './config';
import data from './data';

export const Tag = ({ setTagDragging, addComponent }) => {
  const [, drag] = useDrag({
    item: config.tag,
    begin(monitor) {
      // console.log('拖拽开始', monitor);
      setTagDragging(true);
    },
    end(current, monitor) {
      // console.log('拖拽结束', monitor);
      setTagDragging(false);
      if (monitor.didDrop()) {
        addComponent(createComponent(current.name, data));
      }
    },
  });

  return (
    <div className="w80 h80 ml10 border-base dib" ref={drag}>
      {config.cname}组件
    </div>
  );
};
