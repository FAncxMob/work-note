import React, { useEffect } from 'react';
import { history, connect } from 'umi';
import { Card, Form } from 'antd';
import CustomerForm from '@/components/CustomerForm';
import styles from './style.less';

const InductedInfo = (props) => {
  const [form] = Form.useForm();
  const attrMap = [
    { value: 1, label: '生产商' },
    { value: 2, label: '贸易商' },
    { value: 3, label: '品牌方' },
    { value: 4, label: '原产基地' },
  ];
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  
  const editFormList = [
    {
      type: 'input',
      name: 'name',
      label: '供货商名称',
      placeholder: '请输入供货商名称',
      extra: <span className='por top-5 color999'>需与当地政府颁发的商业许可证书或企业注册证上的企业名称完全一致，信息审核审核成功后，供货商名称不可修改。</span>,
      formItemOption: {
        className: 'mb10',
      },
      rule: [{ required: true, message: '供货商名称不能为空!' }]
    },
    {
      type: 'input',
      name: 'code',
      label: '统一社会信用代码',
      placeholder: '请输入统一社会信用代码',
      extra: <span className='por top-5 color999'>请输入15位营业执照注册号或18位的统一社会信用代码</span>,
      formItemOption: {
        className: 'mb10',
      },
      rule: [{ required: true, message: '统一社会信用代码不能为空!' }]
    },
    {
      type: 'input',
      name: 'ContactName',
      label: '联系人姓名',
      placeholder: '请输入联系人姓名',
      formItemOption: {
        className: 'mb10',
      },
      rule: [
        { required: true, message: '联系人姓名不能为空!'},
        { max: 8, message: '姓名限8个字以内！' }
      ]
    },
    {
      type: 'radio',
      name: 'attribute',
      label: '供货商属性',
      formItemOption: {
        className: 'mb0',
      },
      elOptions: {
        options: attrMap,
        optionType: 'button',
        buttonStyle: 'solid',
        size: 'middle'
      }
    },
  ];

  useEffect(() => {
    
  }, []);

  return (
    <div className='w100p df justify-center'>
      <Card title={<p className='text-center mb0 fz20'>供货商信息登记</p>} className='w600 bdr5'>
        <CustomerForm
          formItemLayout={layout}
          layout={layout}
          FormList={editFormList}
          hideButton
          form={form}
        />
      </Card>
    </div>
  );
};

export default connect(({ login }) => ({
  userLogin: login,
}))(InductedInfo);
