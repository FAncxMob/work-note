import { StyleCnameMap } from './lib/config';
import {
  settingsStylePart,
  getStylePartParam,
  getStyleAnalysisPattern,
  getStyleUnit,
} from './lib/settingStylePart';

export const NormalSetValue = ({ partName, prop, value, changeCss }) => {
  const list = getStyleAnalysisPattern(prop).exec(value);
  value = list ? list[0] : value;
  const changeValue = (val) => {
    if (val.target) {
      val = val.target.value;
    }
    changeCss(partName, prop, val + getStyleUnit(prop));
  };

  return (
    <div className="mb10">
      <div className="mb5">{StyleCnameMap[prop]}</div>
      {settingsStylePart(prop, {
        onChange: (val) => {
          changeValue(val);
        },
        value,
        ...getStylePartParam(prop),
      })}
    </div>
  );
};
