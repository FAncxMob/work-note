import { objectMerge } from './object';
import { isType } from './type';

let localConfig = {};

try {
  const data = JSON.parse(window.localStorage.getItem('localConfig'));
  localConfig = isType(data, 'object') ? data : {};
} catch (error) {
  console.error(error);
}

const config = (window || global).g_config || {};
const finalConfig = objectMerge(localConfig, config);

window.localStorage.setItem('localConfig', JSON.stringify(finalConfig));

export default finalConfig;
