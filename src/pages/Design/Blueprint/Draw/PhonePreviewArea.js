import { useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';

import { showComponent } from './showComponent';

import types from './data/types';

import stylesCommon from './style/common.less';

export const PhonePreviewArea = ({
  move,
  components,
  getPlaceholderIndex,
  delComponent,
  addPlaceholder,
  delPlaceholder,
  isTagDragging,
  selectedId,
  setSelectedId,
}) => {
  const [isDrop, setIsDrop] = useState(false);

  const [collectProps, dropContainer] = useDrop({
    accept: types.componentTag,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {},
    drop: (item, monitor) => {
      setIsDrop(true);
    },
  });

  useEffect(() => {
    if (collectProps.isOver && isTagDragging) {
      addPlaceholder();
    } else if (!isDrop) {
      delPlaceholder();
    }
  }, [collectProps.isOver, isDrop, addPlaceholder, delPlaceholder, isTagDragging]);

  return (
    <div ref={dropContainer} className="w300 ml20 mr20 bgc-base">
      {components.map(({ name, ...rest }, index) => {
        return (
          <div
            key={rest.id}
            onClick={() => {
              setSelectedId(rest.id);
            }}
            className={[
              stylesCommon['components-box'],
              selectedId === rest.id ? stylesCommon.selectedComponent : null,
            ].join(' ')}
          >
            <div
              className="del-btn"
              onClick={() => {
                delComponent(index);
              }}
            />
            {showComponent(name, { move, index, getPlaceholderIndex, ...rest })}
          </div>
        );
      })}
    </div>
  );
};
