import React, { useState, useEffect } from 'react';
import CustomerForm from '@/components/CustomerForm';
import { Form, Modal, Row, Col, Input, Popover, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { encryptName, transformFenToYuan, transformYuanToFen } from '@/models/wallet/utils';
import { sub } from '@/utils/utils';
import { popWithdrawContent } from '../data';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailFormItemLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const Bank = (props) => {
  const {
    visible,
    dispatch,
    walletInfo: { totalAmount, lockAmount },
    bankModel: { defaultBank, bankList },
  } = props;

  const [formEdit] = Form.useForm();
  const [serviceFee, setServiceFee] = useState(0);
  const [reallyAmount, setReallyAmount] = useState(0);
  // const [selectLoading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [handleFee, setHandleFee] = useState(0);
  const [selectedBank, setSelectedBank] = useState(defaultBank || {}); // 选中的银行卡
  const availableYuan = transformFenToYuan(totalAmount - lockAmount);

  // form初始值
  const onInitialValues = (bankObj) => {
    const initialValues = {
      amount: '',
      bankId: bankObj.id,
    };
    setSelectedBank({ ...bankObj });
    formEdit.setFieldsValue(initialValues);
  };

  const handleAllAmount = async () => {
    await formEdit.setFieldsValue({ amount: availableYuan });
    formEdit.validateFields();
  };

  const handleOk = () => {
    formEdit
      .validateFields()
      .then((res) => {
        setConfirmLoading(true);
        const { bankId } = res;
        dispatch({
          type: 'walletModel/applyToBank',
          payload: { amount: transformYuanToFen(reallyAmount), bankId },
          callback: (response) => {
            setConfirmLoading(false);
            if (response) {
              message.success('提现申请成功');
              props.closeModal();
            }
          },
        });
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setConfirmLoading(false);
    props.closeModal();
  };

  const bankOnChange = async (e) => {
    const sel = (bankList.filter((v) => e === v.id) || [])[0];
    await setSelectedBank({ ...sel } || {});
    formEdit.validateFields();
  };

  useEffect(() => {
    // 获取默认银行卡
    dispatch({
      type: 'bankModel/getDefault',
      payload: {},
      callback: (bankObj) => {
        onInitialValues(bankObj);
      },
    });
  }, [visible]);

  useEffect(() => {
    // 获取银行卡
    if (bankList.length) return;
    dispatch({
      type: 'bankModel/getList',
      payload: {},
      callback: () => {
        // setLoading(false);
      },
    });
  }, []);

  const calculate = async (val) => {
    // 计算各种金额
    if (!val || !selectedBank) return;
    // 计算手续费 服务费（计算银行卡提现手续费(目前与提现金额无关。后续可能会改变)）
    const hFee = selectedBank.isPrivate ? '1.00' : '10.00';
    const sFee = (Math.ceil(val * 0.006 * 100) / 100).toFixed(2);
    setServiceFee(sFee);
    setHandleFee(hFee);
    setReallyAmount(sub(sub(val, sFee), hFee));
  };

  const renderForm = () => {
    const selBankList = (bankList || []).map((v) => {
      const text = `${v.cardNo}--${v.isPrivate ? encryptName(v.owner) : v.owner} (${
        v.isPrivate ? '个人账户' : '对公账户'
      })`;
      return {
        text,
        value: v.id,
      };
    });
    const formList = [
      {
        el: (
          <span>
            {availableYuan}{' '}
            <a className="ml10" onClick={handleAllAmount}>
              全部提现
            </a>
          </span>
        ),
        label: '可提现金额',
      },
      {
        type: 'select',
        optionData: selBankList,
        selectAll: false,
        elOptions: {
          // loading: selectLoading,
          onChange: bankOnChange,
        },
        name: 'bankId',
        label: '收款人',
      },
      {
        el: (
          <Row gutter={8} className="align-center">
            <Col span={8}>
              <Form.Item name="amount" noStyle>
                <Input maxLength="12" autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <span className="color666">服务费:￥{serviceFee}</span>
              <span className="color666 ml10">手续费:￥{handleFee}</span>
            </Col>
          </Row>
        ),
        type: 'input',
        name: 'amount',
        label: '提现金额',
        placeholder: '请输入提现金额',
        rule: [
          {
            validator: (rule, value, callback) => {
              try {
                let min;
                let max;
                let name;

                if (selectedBank.isPrivate) {
                  min = 5;
                  max = Math.min(50000, availableYuan);
                  name = '对私银行卡';
                } else {
                  min = 15;
                  max = Math.min(500000, availableYuan);
                  name = '对公银行卡';
                }
                if (!String(value || '').trim()) throw new Error('提现金额不能为空');
                if (!/^\d+(\.\d{1,2})?$/gi.test(value))
                  throw new Error('提现金额必须为数字,且支持小数点后2位');
                else if (Number(value) < min || Number(value) > max)
                  throw new Error(`${name}时，提现金额必须大于等于${min}，小于等于${max}`);

                // 计算服务费 实际到账金额等
                calculate(value);

                callback();
              } catch (error) {
                callback(error);
              }
            },
          },
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
        form={formEdit}
      />
    );
  };

  const modalTitle = (
    <div>
      <span>提现 </span>
      <Popover content={popWithdrawContent} trigger="hover">
        <ExclamationCircleOutlined className="text-warning mr3 ml3" />
      </Popover>
    </div>
  );
  return (
    <Modal
      title={modalTitle}
      visible={visible}
      footer={[
        <span className="mr15 text-red">实际到账￥{reallyAmount}</span>,
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
          确定
        </Button>,
      ]}
      okText="确定"
      onCancel={handleCancel}
    >
      {renderForm()}
    </Modal>
  );
};
export default Bank;
