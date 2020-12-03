import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import mapData from '@/common/city';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import styles from './index.less';

const TransferBody = (props) => {
  const P = {};
  const [closed, setClosed] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');

  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);

  const [leftOpens, setLeftOpens] = useState([]);
  const [rightOpens, setRightOpens] = useState([]);

  const { initialData = {}, code, visible, onClose, onConfirm } = props;

  useEffect(() => {
    if (!visible) {
      setSelectedData([]);
      setLeftInput('');
      setRightInput('');
      setLeftSelected([]);
      setRightSelected([]);
      setLeftOpens([]);
      setRightOpens([]);
    } else onLoad();
  }, [code, visible]);

  const onLoad = () => {
    const { selDataMap } = getData();
    for (const key in initialData) {
      if (initialData.hasOwnProperty(key)) {
        const item = initialData[key];

        if (item.all) {
          const temp = mapData.find((x) => {
            return x.adcode === item.code;
          });

          if (typeof temp !== 'undefined') {
            if (temp.hasOwnProperty('districts') && temp.districts.length > 0) {
              temp.districts.forEach((x) => {
                selDataMap.add(x.adcode);
              });
            } else {
              selDataMap.add(temp.adcode);
            }
          }
        } else {
          for (const key in item.list) {
            if (item.list.hasOwnProperty(key)) {
              const child = item.list[key];
              selDataMap.add(child.code);
            }
          }
        }
      }
    }

    setData({ selDataMap });
  };

  /**
   * 获取数据
   *
   * @param {String} type - 数据类型 left/right
   * @param {Boolean} [deep=false] - 是否需要深度数据
   * @returns {Object}
   */
  const getData = (type, deep = false) => {
    let selected;
    let opens;
    let checkAll;
    let listData;
    if (type === 'left') {
      selected = new Set(leftSelected);
      opens = new Set(leftOpens);
      if (deep) {
        checkAll = leftCheckAll;
        listData = leftData;
      }
    } else if (type === 'right') {
      selected = new Set(rightSelected);
      opens = new Set(rightOpens);
      if (deep) {
        checkAll = rightCheckAll;
        listData = rightData;
      }
    }

    const selDataMap = new Set(selectedData);

    return {
      selected,
      opens,
      checkAll,
      listData,
      selDataMap,
    };
  };
  const leftData = useMemo(() => {
    let temp = JSON.parse(JSON.stringify(mapData));

    const { selDataMap } = getData();

    if (leftInput !== '') {
      temp = temp.filter((item) => {
        if (item.name.includes(leftInput)) return true;
        if (item.hasOwnProperty('districts') && item.districts.length > 0) {
          item.districts = item.districts.filter((child) => {
            return child.name.includes(leftInput);
          });
          if (item.districts.length > 0) {
            return true;
          }
        }
      });
    }

    if (selDataMap.size > 0) {
      temp = temp.filter((item) => {
        if (item.hasOwnProperty('districts') && item.districts.length > 0) {
          item.districts = item.districts.filter((child) => {
            return !selDataMap.has(child.adcode);
          });

          if (item.districts.length > 0) {
            return true;
          }
          return false;
        }
        if (selDataMap.has(item.adcode)) {
          return false;
        }
        return true;
      });
    }

    return temp;
  }, [leftInput, selectedData]);

  const rightData = useMemo(() => {
    let temp = JSON.parse(JSON.stringify(mapData));
    const { selDataMap } = getData();

    if (selDataMap.size === 0) {
      return [];
    }

    if (rightInput !== '') {
      temp = temp.filter((item) => {
        if (item.name.includes(rightInput)) return true;
        if (item.hasOwnProperty('districts') && item.districts.length > 0) {
          item.districts = item.districts.filter((child) => {
            return child.name.includes(rightInput);
          });
          if (item.districts.length > 0) {
            return true;
          }
        }
      });
    }

    if (selDataMap.size > 0) {
      temp = temp.filter((item) => {
        if (item.hasOwnProperty('districts') && item.districts.length > 0) {
          item.districts = item.districts.filter((child) => {
            return selDataMap.has(child.adcode);
          });

          if (item.districts.length > 0) {
            return true;
          }
          return false;
        }
        if (selDataMap.has(item.adcode)) {
          return true;
        }
        return false;
      });
    }

    return temp;
  }, [rightInput, selectedData]);

  const leftCheckAll = useMemo(() => {
    const { selected } = getData('left');
    if (typeof selected === 'undefined' || selected.size === 0) {
      return 0; // 子级全未选中
    }

    const arr = leftData.flatMap((x) => {
      const _arr = [];
      if (x.hasOwnProperty('districts') && x.districts.length > 0) {
        x.districts.forEach((child) => {
          _arr.push(child.adcode);
        });
      } else {
        _arr.push(x.adcode);
      }
      return _arr;
    });

    let con = 0; // 用来记录子级有多少选中
    arr.forEach((adcode) => {
      if (selected.has(adcode)) {
        con++;
      }
    });

    if (con === arr.length) {
      return 2; // 子级全部选中
    }
    return 1; // 子级选中部分
  }, [leftSelected, rightData]);

  const rightCheckAll = useMemo(() => {
    const { selected } = getData('right');
    if (typeof selected === 'undefined' || selected.size === 0) {
      return 0; // 子级全未选中
    }

    const arr = rightData.flatMap((x) => {
      const _arr = [];
      if (x.hasOwnProperty('districts') && x.districts.length > 0) {
        x.districts.forEach((child) => {
          _arr.push(child.adcode);
        });
      } else {
        _arr.push(x.adcode);
      }
      return _arr;
    });

    let con = 0; // 用来记录子级有多少选中
    arr.forEach((adcode) => {
      if (selected.has(adcode)) {
        con++;
      }
    });

    if (con === arr.length) {
      return 2; // 子级全部选中
    }
    return 1; // 子级选中部分
  }, [rightSelected, rightData]);

  /**
   * 设置数据
   *
   * @param {Object} options
   * @param {Object} options.selected
   * @param {Object} options.opens
   * @param {Object} options.selDataMap
   * @param {String} options.type - 数据类型 left/right
   */
  const setData = ({ selected, opens, selDataMap, type }) => {
    if (type === 'left') {
      if (selected) setLeftSelected(Array.from(selected));
      if (opens) setLeftOpens(Array.from(opens));
    } else if (type === 'right') {
      if (selected) setRightSelected(Array.from(selected));
      if (opens) setRightOpens(Array.from(opens));
    }

    if (selDataMap) setSelectedData(Array.from(selDataMap));
  };

  /**
   * 判断当前是否选中
   *
   * @param {String} adcode
   * @param {String} type
   * @returns {Boolean} Boolean
   */
  const isSelected = (adcode, type) => {
    if (type === 'left') {
      return leftSelected.includes(adcode);
    }

    if (type === 'right') {
      return rightSelected.includes(adcode);
    }
  };

  /**
   * 判断当前省级状态
   *
   * @param {Object} province
   * @param {String} type
   * @returns {Number} 1 部分选中 2 全部选中 0 没有选中
   */
  const checkStatus = (province, type) => {
    if (province.hasOwnProperty('districts') && province.districts.length > 0) {
      let con = 0;
      const { districts } = province;
      districts.forEach((child) => {
        if (isSelected(child.adcode, type)) {
          con++;
        }
      });

      if (con < districts.length && con > 0) {
        return 1;
      }
      if (con === districts.length) {
        return 2;
      }
      return 0;
    }
    const { adcode } = province;
    if (isSelected(adcode, type)) {
      return 2;
    }
    return 0;
  };

  /**
   * 判断是否展开子级
   *
   * @param {String} adcode
   * @param {String} type
   * @returns {Boolean} Boolean
   */
  const isOpen = (adcode, type) => {
    if (type === 'left') {
      return leftOpens.includes(adcode);
    }

    if (type === 'right') {
      return rightOpens.includes(adcode);
    }
  };

  /**
   * 切换展开子级
   *
   * @param {String} adcode
   * @param {String} type
   */
  const toggle = (adcode, type) => {
    const { opens } = getData(type);

    if (isOpen(adcode, type)) {
      opens.delete(adcode);
    } else {
      opens.add(adcode);
    }

    setData({
      opens,
      type,
    });
  };

  /**
   * 处理记录选中的数组
   *
   * @param {String} adcode
   * @param {String} type
   * @returns true 新增 false 删除
   */
  const handleSelected = (adcode, type) => {
    const { selected } = getData(type);

    if (isSelected(adcode, type)) {
      selected.delete(adcode);
    } else {
      selected.add(adcode);
    }

    setData({ selected, type });
  };

  /**
   * 处理省级变化
   *
   * @param {Object} province
   * @param {String} type
   */
  const handleProvinceChange = (province, type) => {
    const { selected } = getData(type);
    const { adcode, districts } = province;

    switch (checkStatus(province, type)) {
      case 0:
      case 1:
        if (province.hasOwnProperty('districts') && province.districts.length > 0) {
          districts.forEach((item) => {
            selected.add(item.adcode);
          });
        } else {
          selected.add(adcode);
        }
        break;

      case 2:
        if (province.hasOwnProperty('districts') && province.districts.length > 0) {
          districts.forEach((item) => {
            selected.delete(item.adcode);
          });
        } else {
          selected.delete(adcode);
        }
        break;
      default:
        break;
    }

    setData({
      selected,
      type,
    });
  };

  /**
   * 处理市级变化
   *
   * @param {Object} province
   * @param {Object} city
   * @param {String} type
   */
  const handleCityChange = (province, city, type) => {
    handleSelected(city.adcode, type);
  };

  /**
   * 处理全选
   *
   * @param {String} type
   */
  const handleCheckAll = (type) => {
    let { checkAll, listData, selected } = getData(type, true);

    listData = listData.flatMap((child) => {
      const arr = [];
      if (child.hasOwnProperty('districts') && child.districts.length > 0) {
        child.districts.forEach((_child) => {
          arr.push(_child.adcode);
        });
      } else {
        arr.push(child.adcode);
      }
      return arr;
    });

    switch (checkAll) {
      case 0:
      case 1:
        listData.forEach((adcode) => {
          selected.add(adcode);
        });
        break;

      case 2:
        listData.forEach((adcode) => {
          selected.delete(adcode);
        });
        break;
      default:
        break;
    }

    setData({
      selected,
      type,
    });
  };

  /**
   * 数据传递给右侧
   */
  const toRight = () => {
    const type = 'left';
    const { selected, selDataMap } = getData(type);

    selected.forEach((adcode) => {
      selDataMap.add(adcode);
      selected.delete(adcode);
    });

    setData({
      selected,
      selDataMap,
      type,
    });
  };

  /**
   * 数据传递给右侧
   */
  const toLeft = () => {
    const type = 'right';
    const { selected, selDataMap } = getData(type);

    selected.forEach((adcode) => {
      selDataMap.delete(adcode);
      selected.delete(adcode);
    });

    setData({
      selected,
      selDataMap,
      type,
    });
  };

  // #region other

  /**
   * 关闭弹出层
   *
   * @param {Boolean} boolean - 根据真假值判断是成功关闭还是失败关闭
   * @param {Object} data - 返回出去的数据
   */
  const close = (boolean = false, data) => {
    onClose();
    if (boolean) {
      return Promise.resolve(data);
    }
    return Promise.reject('cancel');
  };

  // #endregion
  /**
   * 确定
   */
  const confirm = () => {
    const { selDataMap } = getData();
    const data = {};

    mapData.forEach((item) => {
      if (item.hasOwnProperty('districts') && item.districts.length > 0) {
        let con = 0;
        const list = {};
        // 市
        item.districts.forEach((child) => {
          if (selDataMap.has(child.adcode)) {
            con++;
            list[child.adcode] = {
              all: true,
              code: child.adcode,
              name: child.name,
              list: {},
            };
          }
        });

        if (item.districts.length === con) {
          data[item.adcode] = {
            all: true,
            code: item.adcode,
            name: item.name,
            list: {},
            childCodeStr: Array.from(selDataMap).join(','), // 所有选中的市级id数组字符串
          };
        } else if (con > 0) {
          data[item.adcode] = {
            all: false,
            code: item.adcode,
            name: item.name,
            list,
            childCodeStr: Array.from(selDataMap).join(','),
          };
        }
      } else if (selDataMap.has(item.adcode)) {
        data[item.adcode] = {
          all: true,
          code: item.adcode,
          name: item.name,
          list: {},
          childCodeStr: Array.from(selDataMap).join(','),
        };
      }
    });
    onConfirm(data);
    // close(true, data);
  };

  const modal = createPortal(
    <>
      (
      <div className={styles['geo-transfer-comp']}>
        <div onClick={close} className="mask" />
        <div className="main">
          <div
            aria-label="提示"
            aria-modal="true"
            className="dialog"
            role="dialog"
            style={{ marginTop: '15vh' }}
          >
            <div className="dialog__header">
              <span className="dialog__title">区域选择</span>
              <a
                onClick={close}
                aria-label="Close"
                className="dialog__headerbtn close-btn"
                type="button"
              >
                <i className="dialog__close close-btn-icon" />
              </a>
            </div>
            <div className="dialog__body">
              <div className="geo-transfer">
                <div className="geo-transfer-panel">
                  <p className="geo-transfer-panel__header">
                    <Checkbox
                      onClick={() => handleCheckAll('left')}
                      checked={leftCheckAll === 2}
                      indeterminate={leftCheckAll === 1}
                    >
                      可选省、市
                    </Checkbox>
                  </p>
                  {/* 开始 */}

                  <div className="geo-transfer-panel__body">
                    <div className="geo-transfer-panel__filter">
                      <input
                        clearable="true"
                        placeholder="请输入省、市名称"
                        prefix-icon="icon-search"
                        size="small"
                        value={leftInput}
                        onChange={(e) => setLeftInput(e.target.value)}
                      />
                    </div>

                    {leftData.length > 0 ? (
                      <div className="checkbox-group geo-transfer-panel__list is-filterable">
                        <div style={{ height: '100%' }} wrapclass="scrollbar-y">
                          {leftData.map((province) => {
                            const leftIsOpen = isOpen(province.adcode, 'left');
                            const leftStatus = checkStatus(province, 'left');

                            return (
                              <div key={province.adcode} className="item-box">
                                <Checkbox
                                  onClick={() => handleProvinceChange(province, 'left')}
                                  checked={leftStatus === 2}
                                  indeterminate={leftStatus === 1}
                                >
                                  {province.name}
                                </Checkbox>
                                {province.districts && province.districts.length > 0 ? (
                                  <Button
                                    onClick={() => toggle(province.adcode, 'left')}
                                    className="unfold"
                                  >
                                    {leftIsOpen ? '收起' : '展开'}
                                  </Button>
                                ) : null}
                                {leftIsOpen
                                  ? province.districts.map((city) => (
                                      <div key={city.adcode} className="item-box-sub pl25">
                                        <Checkbox
                                          onClick={() => handleCityChange(province, city, 'left')}
                                          checked={isSelected(city.adcode, 'left')}
                                        >
                                          {city.name}
                                        </Checkbox>
                                      </div>
                                    ))
                                  : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                    {leftData.length === 0 && leftInput !== '' ? (
                      <p className="geo-transfer-panel__empty">无匹配数据</p>
                    ) : null}
                    {leftData.length === 0 &&
                      !(leftData.length === 0 && leftInput !== '' ? (
                        <p className="geo-transfer-panel__empty">无数据</p>
                      ) : null)}
                  </div>

                  {/* 结束 */}
                </div>

                <div className="geo-transfer__buttons">
                  <Button
                    disabled={rightSelected.length === 0}
                    onClick={toLeft}
                    shape="circle"
                    className="geo-transfer__button"
                    icon={<LeftOutlined />}
                    type="primary"
                  />
                  <Button
                    disabled={leftSelected.length === 0}
                    onClick={toRight}
                    shape="circle"
                    className="geo-transfer__button"
                    icon={<RightOutlined />}
                    type="primary"
                  />
                </div>

                <div className="geo-transfer-panel">
                  <p className="geo-transfer-panel__header">
                    <Checkbox
                      onClick={() => handleCheckAll('right')}
                      checked={rightCheckAll === 2}
                      indeterminate={rightCheckAll === 1}
                    >
                      已选省、市
                    </Checkbox>
                  </p>
                  <div className="geo-transfer-panel__body">
                    <div className="geo-transfer-panel__filter">
                      <input
                        clearable="true"
                        placeholder="请输入省、市名称"
                        prefix-icon="icon-search"
                        size="small"
                        value={rightInput}
                        onChange={(e) => setRightInput(e.target.value)}
                      />
                    </div>
                    {rightData.length > 0 ? (
                      <div className="checkbox-group geo-transfer-panel__list is-filterable">
                        <div style={{ height: '100%' }} wrapclass="scrollbar-y">
                          {rightData.map((province) => {
                            const rightIsOpen = isOpen(province.adcode, 'right');
                            const rightStatus = checkStatus(province, 'right');

                            return (
                              <div key={province.adcode} className="item-box">
                                <Checkbox
                                  onClick={() => handleProvinceChange(province, 'right')}
                                  checked={rightStatus === 2}
                                  indeterminate={rightStatus === 1}
                                >
                                  {province.name}
                                </Checkbox>

                                {province.districts && province.districts.length > 0 ? (
                                  <Button
                                    onClick={() => toggle(province.adcode, 'right')}
                                    className="unfold"
                                    size="small"
                                  >
                                    {rightIsOpen ? '收起' : '展开'}
                                  </Button>
                                ) : null}

                                {rightIsOpen
                                  ? province.districts.map((city) => (
                                      <div key={city.adcode} className="item-box-sub pl25">
                                        <Checkbox
                                          onClick={() => handleCityChange(province, city, 'right')}
                                          checked={isSelected(city.adcode, 'right')}
                                        >
                                          {city.name}
                                        </Checkbox>
                                      </div>
                                    ))
                                  : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                    {rightData.length === 0 && rightInput !== '' ? (
                      <p className="geo-transfer-panel__empty">无匹配数据</p>
                    ) : null}
                    {rightData.length === 0 && !(rightData.length === 0 && rightInput !== '') ? (
                      <p className="geo-transfer-panel__empty">无数据</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="dialog__footer">
              <span className="dialog-footer">
                <Button
                  onClick={() => {
                    close();
                  }}
                >
                  取 消
                </Button>
                <Button onClick={() => confirm()} type="primary">
                  确定
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
      )
    </>,
    document.body,
  );
  return <>{visible && modal}</>;
};
export default React.memo(TransferBody);
