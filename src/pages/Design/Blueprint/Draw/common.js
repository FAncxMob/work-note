import defaultComponentData from './data/component';
import defaultPageData from './data/page';

export function createComponent(name, customData) {
  if (typeof name === 'undefined') throw Error('缺少组件关键参数：name');
  const id = new Date().valueOf().toString(36);
  return Object.assign(defaultComponentData, { id, name }, { ...customData });
}

export function createPage(name = '未命名页面') {
  const id = new Date().valueOf().toString(36);
  return Object.assign(defaultPageData, { id, name });
}
