import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import { Form, Modal, Input, message, Tag } from 'antd';
import './index.less';

const MAX_TAG_TEXT_NUM = 10; // 商品商品标签最大字数

const PatchAddModal = (props) => {
  const { visible, setVisible, onOk, keyword = '分类' } = props;
  const [form] = Form.useForm();

  const [correctTagArr, setCorrectTagArr] = useState([]); // 准备添加的正确的分类
  const [wrongTagArr, setWrongTagArr] = useState([]); // 无法添加的分类

  const [inputTagText, setInputTagText] = useState(''); // 输入框中的内容

  // 监听inputTagText，inputTagText改变则重新渲染准备添加的商品标签和无法添加的商品标签
  useEffect(() => {
    form.setFieldsValue({ names: inputTagText });
    if (inputTagText) {
      // 去重，去空格，判断单个商品标签是否小于10，总数小于50
      const arr = Array.from(new Set(inputTagText.split(',')));

      const correctArr = [];
      const wrongArr = [];

      arr.forEach((v) => {
        v = v.trim();
        if (!v) return;
        if (v.length <= MAX_TAG_TEXT_NUM) correctArr.push(v);
        else wrongArr.push(v);
      });
      setCorrectTagArr(correctArr);
      setWrongTagArr(wrongArr);
    } else {
      setCorrectTagArr([]);
      setWrongTagArr([]);
    }
  }, [inputTagText]);

  function handleSubmit() {
    if (!correctTagArr) {
      message.warning('请输入符合规范的分类名称');
      return;
    }
    onOk(correctTagArr);
    setCorrectTagArr([]);
    setWrongTagArr([]);
    setInputTagText('');
    setVisible(false);
  }

  // 添加输入框按回车后，相当于输了逗号
  async function onPressEnter(e) {
    e.preventDefault();
    await setInputTagText(`${inputTagText},`);
  }

  // 操作间隔160ms后才会触发fun
  function debounceInput(fun, delay = 160) {
    return (args) => {
      const newArgs = args;
      clearTimeout(fun.id);
      fun.id = setTimeout(() => {
        fun.call(this, newArgs);
      }, delay);
    };
  }

  // 添加输入框change
  async function handleTextAreaChange(value) {
    value = value.replace(/，/gi, ',');
    await setInputTagText(value);
  }

  // 从 准备添加的分类 和 无法添加的分类 中 删除分类
  function deleteInputTag(e, value) {
    e.preventDefault();
    const reg = new RegExp(`${value},?`, 'g');
    setInputTagText(inputTagText.replace(reg, ''));
  }

  // 渲染 准备添加的分类 和 无法添加的分类
  function renderInputTag() {
    const elCorrectArr = [];
    const elWrongArr = [];

    correctTagArr.forEach((value) => {
      elCorrectArr.push(
        <Tag
          onClose={(e) => deleteInputTag(e, value)}
          color="blue"
          key={value}
          closable
          className="dib mb10"
        >
          {value}
        </Tag>,
      );
    });
    wrongTagArr.forEach((value) => {
      elWrongArr.push(
        <Tag
          onClose={(e) => deleteInputTag(e, value)}
          color="red"
          key={value}
          closable
          className="dib mb10"
        >
          {value}
        </Tag>,
      );
    });

    return (
      <>
        {elCorrectArr.length ? (
          <>
            <div className="mt20 mb10">当前准备添加的{keyword}为：</div>
            {elCorrectArr}
          </>
        ) : null}
        {elWrongArr.length ? (
          <>
            <div className=" mb10">无法添加的{keyword}为：</div>
            {elWrongArr}
          </>
        ) : null}
        <div className="mb10">
          准备添加的{keyword}共
          <span style={{ color: '#0066FF', margin: '0 5px' }}>{correctTagArr.length}</span>个
        </div>
      </>
    );
  }

  return (
    <Modal
      forceRender
      onOk={handleSubmit}
      onCancel={() => setVisible(false)}
      visible={visible}
      title={`批量添加${keyword}`}
      width={600}
    >
      <Form form={form}>
        <p className="fz12  mb20">
          如果已有同名{keyword}，则不会添加该{keyword}！
        </p>
        <Form.Item name="names" label={`${keyword}名称`} rules={[{ required: true }]}>
          <Input.TextArea
            autoFocus
            allowClear
            placeholder={`请输入${keyword}名称，多个${keyword}以逗号隔开`}
            onPressEnter={onPressEnter}
            autoSize={{ minRows: 1 }}
            onChange={(e) => debounceInput(handleTextAreaChange)(e.target.value)}
          />
        </Form.Item>
        {renderInputTag()}
      </Form>
    </Modal>
  );
};

export default connect(({ goodsWarehouseCategory, loading }) => ({
  goodsWarehouseCategory,
  loading: loading.models.goodsWarehouseCategory,
}))(PatchAddModal);
