import { useMemo } from 'react';
import { Tabs } from 'antd';
import { settingsComponent } from './settingsComponent';
import { methodType } from './data/types';
import CSSTemplate from './CSSTemplate';

const { TabPane } = Tabs;

export const SettingsArea = ({ components, selectedId, changeCss, changeData, changeMethod }) => {
  const currentComponent = useMemo(() => components.find((item) => item.id === selectedId), [
    components,
    selectedId,
  ]);

  if (typeof currentComponent === 'undefined') {
    return (
      <div className="app-card-lv1 w400">
        <h6>内容编辑区</h6>
        请选择组件编辑
      </div>
    );
  }

  const { style, settings, method, data } = currentComponent;

  return (
    <div className="app-card-lv1 w400 ofs-y">
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="行为编辑区" key="1">
          <div className="">
            {Object.entries(method).map(([key, value]) => (
              <div className="app-card-lv2" key={key.toString()}>
                <h6>{methodType[key]}</h6>
                <div>
                  {settingsComponent(key, {
                    propName: key,
                    value,
                    changeMethod,
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabPane>
        <TabPane tab="内容编辑区" key="2">
          <div className="">
            {settings.map(({ name, cname, type }, index) => (
              <div className="app-card-lv2" key={index.toString()}>
                <h6>{cname}</h6>
                <div>
                  {settingsComponent(type, {
                    propName: name,
                    value: data[name],
                    changeData,
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabPane>
        <TabPane tab="样式编辑区" key="3">
          <div className="">
            {style.parts.map((item, index) => (
              <div className="app-card-lv2" key={index.toString()}>
                <h6>{item.cname}</h6>
                {Object.keys(item).map((prop) => {
                  if (prop === 'name' || prop === 'cname') return null;
                  return (
                    <div key={prop}>
                      {settingsComponent(prop, {
                        partName: item.name,
                        prop,
                        value: item[prop] || CSSTemplate[prop],
                        changeCss,
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
