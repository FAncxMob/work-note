import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { config } from './config';

export const ComponentShow = ({ index, move }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: config.show,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  const [, drop] = useDrop({
    accept: [config.show.type, config.tag.type],
    hover(item, monitor) {
      // console.log(item, monitor);
      if (!ref.current) return;

      // 拖拽目标的Index
      const dragIndex = item.index;
      // 放置目标Index
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // console.log(dragIndex, 'dragIndex');
      // console.log(hoverIndex, 'hoverIndex');

      // 执行 move 回调函数
      move(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const style = useMemo(
    () => ({
      opacity: isDragging ? 0.3 : 1,
    }),
    [isDragging],
  );

  drop(drag(ref));

  return (
    <div className="app-card-lv2" style={style} ref={ref}>
      {config.CNAME}组件{index}
    </div>
  );
};
