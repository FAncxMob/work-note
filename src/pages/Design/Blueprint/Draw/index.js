import React, { useMemo, useState, useEffect, useCallback, useReducer } from 'react';
import { connect } from 'umi';
import { Button, Card, Input, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import arrayMove from '@/utils/arrayMove';

import { isEmptyObject } from '@/utils/type';
import defaultPageData from './data/page';

import { TagArea } from './TagArea';
import { SettingsArea } from './SettingsArea';
import { PhonePreviewArea } from './PhonePreviewArea';
import { createComponent } from './common';
import { Placeholder } from './NormalComponents/Placeholder';

const BlueprintDraw = (props) => {
  const {
    dispatch,
    match: { params },
    blueprint: { page },
  } = props;

  const [isTagDragging, setTagDragging] = useState(false);
  const [pageData, setPageData] = useState(defaultPageData);
  const [selectedId, setSelectedId] = useState(null);

  // console.log(props);

  const savePage = useCallback(() => {
    dispatch({
      type: `blueprint/savePage`,
      param: pageData,
      cb: () => {
        message.success('保存成功');
      },
    });
  }, [dispatch, pageData]);

  useEffect(() => {
    const { id } = params;
    if (!id) return;

    dispatch({
      type: `blueprint/getPage`,
      param: { id },
    });
  }, [dispatch, params]);

  useEffect(() => {
    if (isEmptyObject(page)) return;
    setPageData(page);
  }, [page]);

  // #region 组件修改

  const updateComponents = useCallback(
    (components) => {
      pageData.components = components;
      setPageData(JSON.parse(JSON.stringify({ ...pageData })));
    },
    [pageData],
  );

  const changeCurrentComponent = useCallback(
    (prop, value, find) => {
      const { components } = pageData;
      const currentComponent = components.find((item) => item.id === selectedId);
      const currentPart = find(currentComponent);
      currentPart[prop] = value;

      updateComponents(components);
    },
    [pageData, selectedId, updateComponents],
  );

  const changeCss = useCallback(
    (partName, prop, value) => {
      changeCurrentComponent(prop, value, (currentComponent) =>
        currentComponent.style.parts.find((item) => item.name === partName),
      );
    },
    [changeCurrentComponent],
  );

  const changeData = useCallback(
    (propName, value) => {
      changeCurrentComponent(propName, value, (currentComponent) => currentComponent.data);
    },
    [changeCurrentComponent],
  );

  const changeMethod = useCallback(
    (propName, value) => {
      changeCurrentComponent(propName, value, (currentComponent) => currentComponent.method);
    },
    [changeCurrentComponent],
  );

  // #endregion

  // #region 组件集修改

  const addComponent = useCallback(
    (componentData) => {
      const { components } = pageData;

      const preIndex = components.findIndex((item) => item.name === Placeholder.name);

      if (preIndex > -1) {
        components.splice(preIndex, 1, componentData);
      } else {
        components.push(componentData);
      }

      updateComponents(components);
    },
    [pageData, updateComponents],
  );

  const delComponent = useCallback(
    (index) => {
      const { components } = pageData;
      components.splice(index, 1);
      updateComponents(components);
    },
    [pageData, updateComponents],
  );

  const addPlaceholder = useCallback(() => {
    const { components } = pageData;
    if (!components.find((item) => item.name === Placeholder.name)) {
      addComponent(createComponent(Placeholder.name));
    }
  }, [pageData, addComponent]);

  const delPlaceholder = useCallback(() => {
    const { components } = pageData;
    if (components.find((item) => item.name === Placeholder.name)) {
      updateComponents(components.filter((item) => item.name !== Placeholder.name));
    }
  }, [pageData, updateComponents]);

  // #endregion

  // #region 其他

  const getPlaceholderIndex = useCallback(() => {
    const { components } = pageData;
    return components.findIndex((item) => item.name === Placeholder.name);
  }, [pageData]);

  const move = useCallback(
    (oldIndex, newIndex) => {
      const { components } = pageData;

      if (typeof oldIndex === 'undefined') {
        const str = '出现未知错误，请联系制作者';
        alert(str);
        throw Error(str);
      }

      updateComponents(arrayMove(components, oldIndex, newIndex));
    },
    [pageData, updateComponents],
  );

  // #endregion
  return (
    <PageHeaderWrapper title="编辑蓝图">
      <Card>
        <div className="df">
          <DndProvider backend={HTML5Backend}>
            <div className="df h650 w904">
              <TagArea addComponent={addComponent} setTagDragging={setTagDragging} />
              <PhonePreviewArea
                components={pageData.components}
                delComponent={delComponent}
                addPlaceholder={addPlaceholder}
                delPlaceholder={delPlaceholder}
                isTagDragging={isTagDragging}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                getPlaceholderIndex={getPlaceholderIndex}
                move={move}
              />
              <SettingsArea
                components={pageData.components}
                selectedId={selectedId}
                changeCss={changeCss}
                changeData={changeData}
                changeMethod={changeMethod}
              />
            </div>
          </DndProvider>
          <div className="app-card-lv1 ml20">
            <div className="mb20">
              <Input
                type="text"
                value={pageData.name}
                onChange={(e) => {
                  pageData.name = e.currentTarget.value;
                  setPageData({ ...pageData });
                }}
              />
            </div>
            <Button type="primary" className="mt20" onClick={savePage}>
              保存
            </Button>
            <div className="app-card-lv2">{JSON.stringify(pageData)}</div>
          </div>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, blueprint }) => ({
  blueprint,
  loading: loading.effects['blueprint/getPage'],
}))(BlueprintDraw);
