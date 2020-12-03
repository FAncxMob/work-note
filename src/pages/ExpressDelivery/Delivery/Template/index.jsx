import React from 'react';
import { Button, message, Table, Form, Space, InputNumber } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Transfer from '@/components/Transfer/index';
import EditTpl from '../components/EditTpl/index';
import {
  findIndexById,
  verifyData,
  confirmDel,
  getCity,
  verifyCityRepeat,
  verifyNameRepeat,
} from './fn.js';

@connect(({ deliveryModel, loading }) => ({
  deliveryModel,
  loading: loading.effects['deliveryModel/getList'],
}))
class TemplateIndex extends React.Component {
  state = {
    visible: false, // 是否显示运费模板配置
    rowLoading: {},
    list: [],
    cityVisible: false,
    currentCity: {}, // 当前选择城市的record项
  };

  UNSAFE_componentWillMount() {
    this.onLoad();
  }

  onLoad() {
    this.props.dispatch({
      type: 'deliveryModel/getList',
      payload: {},
      callback: (list = []) => {
        this.setState({ list: JSON.parse(JSON.stringify(list)) });
      },
    });
  }

  // 给某行rule赋值
  setRule = (obj, type, stateAttr) => {
    // type: del  add  update; obj  某条规则值; stateAttr: state的其他属性赋值
    const { list } = this.state;
    const parentIndex = findIndexById(list, obj.tempId);

    const index = findIndexById(list[parentIndex].ruleList, obj.id, obj.newId);
    if (parentIndex <= -1 || (index <= -1 && type !== 'add')) return;

    this.setState((pre) => {
      const child = pre.list[parentIndex].ruleList;
      obj.id = obj.newId || obj.id;
      if (type === 'del') {
        child.splice(index, 1);
      } else if (type === 'add') {
        child.push(obj);
      } else {
        child[index] = { ...obj };
      }
      pre.list[parentIndex].ruleList = [...child];
      return { ...pre, ...stateAttr };
    });
  };

  // 新增模板
  handleAddTpl = () => {
    this.setState({ visible: true });
  };

  // 删除模板
  handleRemoveTpl = async (v) => {
    await confirmDel('template');
    const res = await this.props.dispatch({
      type: 'deliveryModel/del',
      payload: { id: v.id },
    });

    if (res) message.success('删除成功');
    const list = this.state.list.filter((t) => t.id !== v.id);
    this.setState({ list: [...list] });
  };

  // 删除某行
  handleRemove = async (record) => {
    await confirmDel();
    let res;
    if (!/add/.test(record.id)) {
      // 删除数据库的，需请求接口
      res = await this.props.dispatch({
        type: 'deliveryModel/delRow',
        payload: { id: record.id, tempId: record.tempId },
      });
    }
    if (res) message.success('删除成功');
    this.setRule(record, 'del');
  };

  // 关闭增加运费模板弹窗，并给list添加一条数据
  closeEditModal = (obj) => {
    if (obj) {
      const { id, name, fee, ruleId } = obj;
      const { isError, msg } = verifyNameRepeat(name, this.state.list);
      if (isError) return message.warning(msg);

      const item = { id, name, ruleList: [{ code: '0', fee, tempId: id, id: ruleId }] };
      const list = [...this.state.list];
      list.push(item);
      this.setState({ visible: false, list: [...list] });
    } else {
      this.setState({ visible: false });
    }
  };

  handleEdit = (record) => {
    this.setRule({ ...record, editing: true }, 'update');
  };

  // 新增模板里面的某行
  handleAddRow = (v) => {
    const key = Math.random();
    const row = {
      id: `add-${key}`, // 随机id
      tempId: v.id,
      city: '',
      fee: '',
      editing: true,
    };
    this.setRule(row, 'add');
  };

  // 更新保存按钮上的loading
  setLoading = (id, value) => {
    const { rowLoading } = this.state;
    rowLoading[id] = value;
    this.setState({ rowLoading: { ...rowLoading } });
  };

  handleSave = async (record) => {
    try {
      const { isError, query } = verifyData(record);
      if (isError) return;

      this.setLoading(record.id, true);

      const { id } = record;
      const isAdd = /add/.test(id);
      if (!isAdd) query.id = id;
      this.props.dispatch({
        type: `deliveryModel/${isAdd ? 'saveRow' : 'updateRow'}`,
        payload: { ...query },
        callback: (res) => {
          this.setLoading(record.id, false);
          message.success('保存成功');
          return this.setRule({ ...record, id, newId: res.id, editing: false }, 'update');
        },
      });
    } catch (error) {
      this.setLoading(record.id, false);
    }
  };

  handleCancel = (record) => {
    delete record.tempCity;
    const parentIndex = this.state.list.findIndex((v) => v.id === record.tempId);
    if (parentIndex <= -1) return;
    this.setRule({ ...record, editing: false }, 'update');
    this.setLoading(record.id, false);
  };

  // 点击弹出城市选择框
  handleSelectCity = (record) => {
    this.setState({
      currentCity: record,
      cityVisible: true,
    });
  };

  // 确认城市
  onCityConfirm = async (v) => {
    const record = { ...this.state.currentCity };
    const { city, code } = getCity({ cityList: v });
    if (!code) return message.warning('请至少选择一个城市');
    const { isError, msg } = await verifyCityRepeat(v, record, this.state.list);
    if (isError) return message.warning(msg);

    record.tempCity = {
      city,
      code,
      cityList: v,
    };
    this.setRule(record, 'update');
    return this.setState({ cityVisible: false });
  };

  inputOnChange = (e, record, dataIndex) => {
    const val = e;
    this.setRule({ ...record, [dataIndex]: val }, 'update');
  };

  render() {
    const { visible, rowLoading, list, cityVisible, currentCity } = this.state;
    const { dispatch, loading } = this.props;
    const columns = [
      {
        title: '目的地',
        align: 'center',
        editable: true,
        dataIndex: 'city',
        width: '55%',
        render: (val, record) => {
          if (!record.editing || record.code === '0')
            return record.code === '0' ? '默认' : record.city;
          const { tempCity, city } = record;
          return (
            <a
              className="db text-black border-base p5"
              onClick={() => this.handleSelectCity(record)}
            >
              {tempCity ? getCity(tempCity).city : city || '点击选择城市'}
              <DownOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </a>
          );
        },
      },
      {
        title: '运费',
        align: 'center',
        editable: true,
        dataIndex: 'fee',
        width: '20%',
        render: (val, record) => {
          if (!record.editing) return parseFloat(Number(val)).toFixed(2);
          return (
            <InputNumber
              className="text-center"
              min={0}
              max={99999999.99}
              value={val}
              onChange={(e) => this.inputOnChange(e, record, 'fee')}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        editable: false,
        width: 150,
        render: (record, r, index) => {
          const { editing, id } = record;
          return (
            <>
              {!editing ? (
                <>
                  <Button
                    type="link"
                    /* style={{ width: record.code === '0' ? '50%' : '100%' }} */
                    onClick={() => this.handleEdit(record, index)}
                  >
                    编辑
                  </Button>
                  {record.code !== '0' ? (
                    <Button type="link" onClick={() => this.handleRemove(record, index)}>
                      删除
                    </Button>
                  ) : null}
                </>
              ) : (
                <>
                  <Button
                    type="link"
                    loading={!!rowLoading[id]}
                    onClick={() => this.handleSave(record, index)}
                  >
                    保存
                  </Button>
                  {/* 新添加取消就是删除 */}
                  {/add/.test(id) ? (
                    <Button type="link" onClick={() => this.handleRemove(record, index)}>
                      删除
                    </Button>
                  ) : (
                    <Button type="link" onClick={() => this.handleCancel(record, index)}>
                      取消
                    </Button>
                  )}
                </>
              )}
            </>
          );
        },
      },
    ];

    const tempCityList = currentCity.tempCity
      ? currentCity.tempCity.cityList
      : JSON.parse(currentCity.content || '{}');
    return (
      <PageHeaderWrapper title="运费模板">
        <div className="mb20" title="">
          <Button type="primary" onClick={this.handleAddTpl}>
            添加运费模板
          </Button>
        </div>
        <Form component={false}>
          {list.map((v, i) => (
            <div key={v.id} className="mb20">
              <div className="df justify-between align-center mb10">
                <div className="fwb ml5">模板名称：{v.name}</div>
                <Space>
                  <Button type="primary" ghost onClick={() => this.handleRemoveTpl(v, i)}>
                    删除
                  </Button>
                  <Button type="primary" ghost onClick={() => this.handleAddRow(v, i)}>
                    添加规则
                  </Button>
                </Space>
              </div>
              <Table
                className="mb20"
                key={v.id}
                rowKey="id"
                loading={loading}
                dataSource={v.ruleList}
                columns={columns}
                size="small"
                onChange={this.handleTableChange}
                pagination={false}
              />
            </div>
          ))}
        </Form>
        {visible ? (
          <EditTpl dispatch={dispatch} closeModal={(obj) => this.closeEditModal(obj)} />
        ) : null}
        <Transfer
          initialData={tempCityList}
          code={currentCity.code}
          visible={cityVisible}
          onConfirm={this.onCityConfirm}
          onClose={() => this.setState({ cityVisible: false })}
        />
      </PageHeaderWrapper>
    );
  }
}
export default TemplateIndex;
