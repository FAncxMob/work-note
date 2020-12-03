import { Radio } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleCnameMap, imagesMap } from './lib/config';
import {
  settingsStylePart,
  getStylePartParam,
  getStyleAnalysisPattern,
  getStyleUnit,
  getDirectionImg,
} from './lib/settingStylePart';
import { analysisDirectionCSS, makeupDirectionCSS } from './lib/utils';

const Direction = [
  { name: 't', label: '上', value: 0 },
  { name: 'b', label: '下', value: 2 },
  { name: 'l', label: '左', value: 3 },
  { name: 'r', label: '右', value: 1 },
];

const RadiusDirection = [
  { name: 'tl', label: '左上', value: 0 },
  { name: 'tr', label: '右上', value: 1 },
  { name: 'br', label: '右下', value: 2 },
  { name: 'bl', label: '左下', value: 3 },
];

const options = [
  { label: '统一设置', value: 'all' },
  { label: '单独设置', value: 'single' },
];

export const DirectionCSS = ({ partName, prop, value, changeCss }) => {
  const [radioVal, setRadioVal] = useState('all');
  const useRadio = useRef(radioVal);

  const valueList = useMemo(() => {
    const list = analysisDirectionCSS(value, getStyleAnalysisPattern(prop));

    if (new Set(list).size === 4 && useRadio.current === 'all') {
      setRadioVal('single');
    }

    return list;
  }, [value, prop]);

  const changeSingle = (val, index) => {
    if (val.target) {
      val = val.target.value;
    }
    valueList[index] = String(val);
    const newList = makeupDirectionCSS(valueList);
    const newVal = newList.map((i) => `${i}${getStyleUnit(prop)}`).join(' ');
    changeCss(partName, prop, newVal);
  };

  function changeAll(val) {
    if (val.target) {
      val = val.target.value;
    }
    changeCss(partName, prop, `${val}${getStyleUnit(prop)}`);
  }

  function getSingleVal(index) {
    return valueList[index] || valueList[0];
  }

  return (
    <div className="mb10 pb10 ">
      <div className="mb10">{StyleCnameMap[prop]}</div>
      <div className="mb10">
        <Radio.Group
          options={options}
          value={radioVal}
          onChange={(e) => {
            setRadioVal(e.target.value);
          }}
        />
      </div>

      {radioVal === 'all' ? (
        <div className="df align-center">
          <img className="w30 h30 mr10" src={imagesMap[getDirectionImg(prop)]} alt="统一设置" />
          <div className="fx1">
            {settingsStylePart(prop, {
              onChange: (val) => {
                changeAll(val);
              },
              value: valueList[0],
              ...getStylePartParam(prop),
            })}
          </div>
        </div>
      ) : (
        <>
          {(prop === 'borderRadius' ? RadiusDirection : Direction).map((i, index) => (
            <div className="df align-center mb10" key={index}>
              <img
                className="w30 h30 mr10"
                src={imagesMap[`${`${getDirectionImg(prop)}_${i.name}`}`]}
                alt={i.label}
              />
              <div className="fx1">
                {settingsStylePart(prop, {
                  onChange: (val) => {
                    changeSingle(val, i.value);
                  },
                  value: getSingleVal(i.value),
                  ...getStylePartParam(prop),
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
