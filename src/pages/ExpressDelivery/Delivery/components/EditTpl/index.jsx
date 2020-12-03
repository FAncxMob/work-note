import React from 'react';
import { Modal } from 'antd';
import CustomerForm from '@/components/CustomerForm';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailFormItemLayout = {
  wrapperCol: { offset: 6, span: 14 },
};

class EditTpl extends React.Component {
  formRef = React.createRef();

  state = {
    okLoading: false,
  };

  handleSubmit = () => {
    this.formRef.current
      .validateFields()
      .then(async (res) => {
        this.setState({ okLoading: true });
        const params = res;
        params.fee = parseFloat(Number(res.fee)).toFixed(2);
        return this.props.dispatch({
          type: 'deliveryModel/createTemplate',
          payload: params,
          callback: (response) => {
            this.setState({ okLoading: false });
            const { id, ruleId } = response;
            if (response) this.props.closeModal({ ...params, id, ruleId });
          },
        });
      })
      .catch(() => {});
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  // 渲染表单
  renderForm = () => {
    const formList = [
      {
        type: 'input',
        name: 'name',
        label: '模板名称',
        elOptions: {
          maxLength: 18,
          placeholder: '请输入模板名称，最多18个字',
        },
        rule: [{ required: true }],
      },
      {
        type: 'input',
        name: 'fee',
        label: '默认运费',
        rule: [
          { required: true },
          { pattern: /^(\d)+(\.\d{1,2})?$/gi, message: '仅能输入数字，且小数点后最多保留2位' },
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
        formRef={this.formRef}
      />
    );
  };

  render() {
    return (
      <Modal
        title="新增运费模板"
        visible
        onOk={this.handleSubmit}
        confirmLoading={this.state.okLoading}
        onCancel={this.handleCancel}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
export default EditTpl;
