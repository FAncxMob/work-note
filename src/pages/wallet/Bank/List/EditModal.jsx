import React from 'react';
import { Radio, message, Select, Modal } from 'antd';
import CustomerForm from '@/components/CustomerForm/index';

import { transferBank } from '@/models/wallet/utils';

const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailFormItemLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

class EditModal extends React.Component {
  formRef = React.createRef();

  state = {
    channelNo: '',
    addressList: [], // 搜索出来的开户行地址
    okLoading: false,
    typeIsPrivate: true, // 是否是个人账户
  };

  // 搜索开户行
  handleSearch = (value) => {
    this.props.dispatch({
      type: 'bankModel/getAddressList',
      payload: { name: value },
      callback: (list) => {
        this.setState({ addressList: list });
      },
    });
  };

  // 表单赋值
  setFormValue = (obj) => {
    this.formRef.current.setFieldsValue(obj);
  };

  // 开户行
  handleAddress = (e) => {
    this.setFormValue({ address: e });
    this.setState({ channelNo: e.value });
  };

  // 账户名中文
  handleOwnerChange = (e) => {
    this.setFormValue({ owner: e.target.value.replace(/[^a-zA-Z\u4E00-\u9FA5]/gi, '') });
  };

  // 银行卡转换 4位 一空格
  cardOnChange = (e) => {
    this.setFormValue({ cardNo: transferBank(e.target.value) });
  };

  // 账户类型变化
  privateOnChange = (e) => {
    this.setState({ typeIsPrivate: e.target.value });
  };

  // 验证表单
  verify = async (values) => {
    const { id, cardNo, owner, isOwner, isPrivate } = values;
    const params = { id, cardNo, owner, isOwner, isPrivate };
    if (!isPrivate) {
      const { channelNo } = this.state;
      if (!channelNo) {
        message.warning('您输入的开户行信息匹配不到联行号, 请重新填写！');
        return { isError: true };
      }
      params.channelNo = this.state.channelNo;
    }
    const { validated, name } = await this.props.dispatch({
      type: 'bankModel/validBankCard',
      payload: { cardNo },
    });
    params.name = name;
    if (!validated || !name) {
      message.warning('银行卡号无效，请重新输入');
      return { isError: true };
    }
    return { isError: false, params };
  };

  // 提交
  handleSubmit = () => {
    this.formRef.current
      .validateFields()
      .then(async (res) => {
        this.setState({ okLoading: true });
        const { params, isError } = await this.verify(res);
        if (isError) return this.setState({ okLoading: false });
        return this.props.dispatch({
          type: 'bankModel/addBank',
          payload: params,
          callback: (response) => {
            this.setState({ okLoading: false });
            if (response) this.props.closeModal();
          },
        });
      })
      .catch(() => {});
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  // 渲染表格
  renderForm = () => {
    const initialValues = { isPrivate: true };
    const { typeIsPrivate, addressList } = this.state;
    const options = addressList.map((d) => <Option key={d.channelNo}>{d.address}</Option>);
    const formList = [
      {
        el: (
          <Radio.Group optionType="button" onChange={this.privateOnChange}>
            <Radio.Button value>个人账户</Radio.Button>
            <Radio.Button value={false}>对公账户</Radio.Button>
          </Radio.Group>
        ),
        name: 'isPrivate',
        label: '账户类型',
      },
      {
        el: (
          <Select
            showSearch
            showArrow={false}
            filterOption={false}
            notFoundContent=""
            labelInValue
            onSearch={this.handleSearch}
            onChange={this.handleAddress}
          >
            {options}
          </Select>
        ),
        name: 'address',
        label: '开户行',
        hide: typeIsPrivate,
        rule: [{ required: true }],
      },
      {
        type: 'input',
        elOptions: {
          maxLength: 10,
          onChange: this.handleOwnerChange,
        },
        name: 'owner',
        label: typeIsPrivate ? '持卡人姓名' : '账户名',
        rule: [{ required: true }],
      },
      {
        type: 'input',
        elOptions: {
          onChange: this.cardOnChange,
          maxLength: 23,
        },
        name: 'cardNo',
        label: '银行卡号',
        rule: [
          { required: true },
          { pattern: /^(\d{4}(\s)?){3,4}(\d{3})?$/gi, message: '银行卡号应为15位或19位' },
        ],
      },
    ];
    return (
      <CustomerForm
        formItemLayout={layout}
        tailFormItemLayout={tailFormItemLayout}
        layout={layout}
        FormList={formList}
        hideButton
        initialValues={initialValues}
        formRef={this.formRef}
      />
    );
  };

  render() {
    const { visible } = this.props;
    return (
      <Modal
        title="新增银行卡"
        visible={visible}
        onOk={this.handleSubmit}
        confirmLoading={this.state.okLoading}
        onCancel={this.handleCancel}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
export default EditModal;
