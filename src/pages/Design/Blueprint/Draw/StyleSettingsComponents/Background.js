import { useCallback, useMemo, useRef } from 'react';
import Uploader from '@/components/Uploader';
import { StyleCnameMap } from './lib/config';
import ColorPicker from './Components/ColorPicker';
import BackgroundPosition from './Components/BackgroundPosition';
import BackgroundSize from './Components/BackgroundSize';
import { settingsStylePart, getStylePartParam } from './lib/settingStylePart';

const sizeKeyWords = ['cover', 'contain', 'auto'];

function getBackgroundImageUrlList(val) {
  if (!val) return [];
  const res = val.match(/url\((.+)\)/);
  if (!res) return [];
  return [res[1]];
}

function formatBackgroundSize(width, height) {
  for (const iterator of sizeKeyWords) {
    if (width === iterator) {
      return iterator;
    }
  }
  return `${width} ${height}`;
}

export const Background = ({ partName, prop, value, changeCss }) => {
  const data = useRef({});

  data.current = useMemo(() => {
    const res = value.split(' ');

    for (const iterator of sizeKeyWords) {
      if (res.includes(iterator)) {
        res.splice(7, 0, iterator);
        break;
      }
    }

    const [
      color,
      image,
      backgroundRepeat,
      backgroundAttachment,
      positionLeft,
      positionTop,
      splitSymbol,
      backgroundWidth,
      backgroundHeight,
      backgroundOrigin,
      backgroundClip,
    ] = res;

    return {
      color,
      image,
      backgroundRepeat,
      backgroundAttachment,
      backgroundPosition: `${positionLeft} ${positionTop}`,
      splitSymbol,
      backgroundSize: formatBackgroundSize(backgroundWidth, backgroundHeight),
      backgroundOrigin,
      backgroundClip,
    };
  }, [value]);

  const change = useCallback(
    (info) => {
      const val = Object.values(info);
      changeCss(partName, prop, val.join(' '));
    },
    [changeCss, partName, prop],
  );

  const changePropValue = useCallback(
    (val, propName) => {
      data.current[propName] = val;
      change(data.current);
    },
    [data, change],
  );

  const changeImage = useCallback(
    (list) => {
      const [imageData = {}] = list;
      const { status, fileUrl = '' } = imageData;
      if (status) return;
      changePropValue(`url(${fileUrl})`, 'image');
    },
    [changePropValue],
  );
  return (
    <div className="mb10 pb10">
      <div className="mb10">{StyleCnameMap[prop]}</div>
      {/* 图片 */}
      <div className="mb10">
        <div>背景图片</div>
        <Uploader
          limit={1}
          fileList={getBackgroundImageUrlList(data.current.image)}
          onChange={changeImage}
        />
      </div>

      {/* 颜色 */}
      <div className="df align-center mb10 pb10">
        <div className="mr10">背景颜色</div>
        <ColorPicker
          value={data.current.color}
          onChange={(val) => {
            changePropValue(val, 'color');
          }}
        />
      </div>

      {/* 尺寸 */}
      <div className="mb10 pb10">
        <BackgroundSize
          onChange={(val) => changePropValue(val, 'backgroundSize')}
          value={data.current.backgroundSize}
        />
      </div>

      {/* 平铺 */}
      <div className="mb10 pb10">
        <div className="mb5">平铺</div>
        <div>
          {settingsStylePart('backgroundRepeat', {
            onChange: (e) => {
              changePropValue(e.target.value, 'backgroundRepeat');
            },
            value: data.current.backgroundRepeat,
            ...getStylePartParam('backgroundRepeat'),
          })}
        </div>
      </div>

      {/* 相对定位 */}
      <div className="mb10 pb10">
        <div className="mb5">相对定位</div>
        <div className="fx1">
          {settingsStylePart('backgroundOrigin', {
            onChange: (e) => {
              changePropValue(e.target.value, 'backgroundOrigin');
            },
            value: data.current.backgroundOrigin,
            ...getStylePartParam('backgroundOrigin'),
          })}
        </div>
      </div>

      {/* 裁剪 */}
      <div className="mb10 pb10">
        <div className="mb5">裁剪</div>
        <div>
          {settingsStylePart('backgroundClip', {
            onChange: (e) => {
              changePropValue(e.target.value, 'backgroundClip');
            },
            value: data.current.backgroundClip,
            ...getStylePartParam('backgroundClip'),
          })}
        </div>
      </div>

      {/* 裁剪 */}
      <div className="mb10 pb10">
        <div className="mb5">固定</div>
        <div>
          {settingsStylePart('backgroundAttachment', {
            onChange: (e) => {
              changePropValue(e.target.value, 'backgroundAttachment');
            },
            value: data.current.backgroundAttachment,
            ...getStylePartParam('backgroundAttachment'),
          })}
        </div>
      </div>

      {/* 位置 */}
      <BackgroundPosition
        onChange={(val) => changePropValue(val, 'backgroundPosition')}
        value={data.current.backgroundPosition}
      />
    </div>
  );
};
