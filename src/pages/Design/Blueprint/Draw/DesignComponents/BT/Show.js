import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { config } from './config';

export const Show = ({
  index,
  move,
  getPlaceholderIndex,
  id,
  data,
  style: { parts: styleParts },
}) => {
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
      if (!ref.current) return;

      const dragIndex = typeof item.index === 'undefined' ? getPlaceholderIndex() : item.index; // 拖拽目标的Index
      const hoverIndex = index; // 放置目标Index

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      move(dragIndex, hoverIndex);

      if (typeof item.index !== 'undefined') {
        item.index = hoverIndex;
      }
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
    <div className="app-card-lv2 mb0 mt0" style={style} ref={ref}>
      {config.cname}组件 {id}
      <div style={{ ...styleParts.find((x) => x.name === 'title') }}>{data.title}</div>
      <div style={{ ...styleParts.find((x) => x.name === 'subTitle') }}>{data.subTitle}</div>
    </div>
  );
};
