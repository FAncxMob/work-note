import React, { useEffect, useState } from 'react';
import { getSellCategoryData } from '@/services/sellCategory';
import { Modal, Tag, Form, Radio, Input, message } from 'antd';
import actionMap from '../../../actionMap';

const VerifyModal = (props) => {
  const { onClose, captainId, reLoad, callBack, dispatch } = props;

  const initialValues = { status: '1', remark: '' };
  const [showReason, setShowReason] = useState(initialValues.status);
  const [verifyFormRef] = Form.useForm();

  const handleSubmit = () => {
    const res = verifyFormRef.getFieldsValue();
    if (String(res.status) === '2' && !res.remark) {
      message.warning('请填写不通过理由');
      return;
    }
    if (!captainId) return;
    dispatch({
      type: actionMap.verify,
      payload: { captainId, ...res },
      callback: () => {
        message.success('操作成功');
        reLoad();
        callBack({ captainId, ...res });
        onClose();
      },
    });
  };

  return (
    <Modal style={{ top: '300px' }} onOk={() => handleSubmit()} onCancel={onClose} visible>
      <Form form={verifyFormRef} initialValues={initialValues}>
        <Form.Item label="团长审核意见" name="status" className="mb10">
          <Radio.Group onChange={(e) => setShowReason(e.target.value)}>
            <Radio value="1">审核通过</Radio>
            <Radio value="2">审核不通过</Radio>
          </Radio.Group>
        </Form.Item>
        {String(showReason) === '2' ? (
          <Form.Item className="mb10" name="remark">
            <Input.TextArea
              placeholder="填写不通过的理由，20字以内，必填"
              rows={4}
              maxLength={20}
            />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default VerifyModal;
