import { useCallback, useMemo, useRef, useState } from 'react';
import { Radio } from 'antd';
import { settingsStylePart, getStylePartParam, getStyleUnit } from '../lib/settingStylePart';

const options = [
  { label: '快捷设置', value: 'keyWords' },
  { label: '数值设置', value: 'number' },
];

const SizeOptions = [
  { label: 'cover', value: 'cover' },
  { label: 'contain', value: 'contain' },
  { label: 'auto', value: 'auto' },
];

const sizeKeyWords = ['cover', 'contain', 'auto'];

const BackgroundSize = ({ value, onChange }) => {
  const [typeVal, setTypeVal] = useState('keyWords');
  const data = useRef({});

  data.current = useMemo(() => {
    let width;
    let height;
    let keyWords = '';

    if (sizeKeyWords.includes(value)) {
      keyWords = value;
      width = '0';
      height = '0';
      setTypeVal('keyWords');
    } else {
      [width, height] = value.split(' ');
    }
    return {
      backgroundSizeWidth: parseFloat(width),
      backgroundSizeHeight: parseFloat(height),
      keyWords,
    };
  }, [value]);

  const changeSizeKeyWords = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const ChangeSize = useCallback(
    (val, propName) => {
      data.current[propName] = `${val}`;

      const { backgroundSizeWidth, backgroundSizeHeight } = data.current;
      onChange(
        `${backgroundSizeWidth}${getStyleUnit(
          'backgroundSizeHeight',
        )} ${backgroundSizeHeight}${getStyleUnit('backgroundSizeHeight')}`,
      );
    },
    [data, onChange],
  );
  return (
    <div>
      <div className="mb10">尺寸设置</div>
      <div className="mb10">
        <Radio.Group
          value={typeVal}
          options={options}
          onChange={(e) => setTypeVal(e.target.value)}
        />
      </div>
      {typeVal === 'keyWords' ? (
        <div>
          <Radio.Group
            value={data.current.keyWords}
            options={SizeOptions}
            onChange={changeSizeKeyWords}
            optionType="button"
            size="small"
          />
        </div>
      ) : null}

      {typeVal === 'number' ? (
        <>
          <div className="df align-center">
            <span>宽度</span>
            <div className="fx1 ml10">
              {settingsStylePart('backgroundSizeWidth', {
                onChange: (val) => {
                  ChangeSize(val, 'backgroundSizeWidth');
                },
                value: data.current.backgroundSizeWidth,
                ...getStylePartParam('backgroundSizeWidth'),
              })}
            </div>
          </div>

          <div className="df align-center">
            <span>高度</span>
            <div className="fx1 ml10">
              {settingsStylePart('backgroundSizeHeight', {
                onChange: (val) => {
                  ChangeSize(val, 'backgroundSizeHeight');
                },
                value: data.current.backgroundSizeHeight,
                ...getStylePartParam('backgroundSizeHeight'),
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BackgroundSize;
