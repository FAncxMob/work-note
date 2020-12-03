import { useCallback, useMemo, useRef } from 'react';
import { settingsStylePart, getStylePartParam } from '../lib/settingStylePart';

const style = {
  border: '2px solid #fff',
  cursor: 'pointer',
};

const valueList = [
  '0% 0%',
  '50% 0%',
  '100% 0%',
  '0% 50%',
  '50% 50%',
  '100% 50%',
  '0% 100%',
  '50% 100%',
  '100% 100%',
];

const BackgroundPosition = ({ onChange, value }) => {
  const data = useRef({});

  data.current = useMemo(() => {
    const [left, top] = value.split(' ');
    return { left, top };
  }, [value]);

  const handleChoose = (val) => {
    onChange(val);
  };

  const ChangePosition = useCallback(
    (val, propName) => {
      data.current[propName] = `${val}%`;
      const { left, top } = data.current;
      onChange(`${left} ${top}`);
    },
    [onChange],
  );

  return (
    <div>
      <div className="df align-center mb10 ">
        <span className="mr10">位置</span>
        <div className="df w60 h60 flex-wrap">
          {valueList.map((i) => (
            <div
              className={`w20 h20 ${
                `${data.current.left} ${data.current.top}` === i ? 'bgc-primary' : 'bgc-lighter'
              }`}
              key={i}
              style={style}
              onClick={() => handleChoose(i)}
            />
          ))}
        </div>
      </div>

      <div className="df align-center mb10 ">
        <span>右移</span>
        <div className="fx1 ml10">
          {settingsStylePart('backgroundPositionLeft', {
            onChange: (val) => {
              ChangePosition(val, 'left');
            },
            value: parseFloat(data.current.left),
            ...getStylePartParam('backgroundPositionLeft'),
          })}
        </div>
      </div>

      <div className="df align-center mb10 ">
        <span>下移</span>
        <div className="fx1 ml10">
          {settingsStylePart('backgroundPositionTop', {
            onChange: (val) => {
              ChangePosition(val, 'top');
            },
            value: parseFloat(data.current.top),
            ...getStylePartParam('backgroundPositionTop'),
          })}
        </div>
      </div>
    </div>
  );
};

export default BackgroundPosition;
