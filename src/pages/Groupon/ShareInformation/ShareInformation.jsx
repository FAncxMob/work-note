import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, message } from 'antd';
import { connect, history } from 'umi';

import emojiMap, { Emoji, EmojiHtml } from './emoji';
import GrouponHeader from '../components/GrouponHeader';

import styles from './index.less';

const TextEditArea = ({ className, value, onChange, onSave }) => {
  const el = useRef(null);

  function chooseEmoji(index) {
    const emojiText = emojiMap[index];
    const { selectionStart, selectionEnd } = el.current;
    const startString = value.substring(0, selectionStart);
    const endString = value.substring(selectionEnd);
    onChange(startString + emojiText + endString);

    setTimeout(() => {
      const newStartPos = selectionStart + emojiText.length;
      el.current.focus();
      el.current.setSelectionRange(newStartPos, newStartPos);
    }, 0);
  }

  return (
    <div className={['app-card-lv1', className].join(' ')}>
      <div className="text app-card-lv2">
        <h6>文本内容</h6>
        <textarea ref={el} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="emoji app-card-lv2">
        <h6>插入表情</h6>
        <div className="emoji-box">
          {emojiMap.map((val) => (
            <Emoji key={`emoji-${val}`} name={val} onClick={chooseEmoji} />
          ))}
        </div>
      </div>
      <div className="btn-box">
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  );
};

const ShowArea = ({ className, value }) => {
  const html = value
    .replace(/\[[^[]+?\]/g, (val) => {
      if (emojiMap.find((x) => x === val)) {
        return EmojiHtml(val);
      }
      return val;
    })
    .replace(/\n/g, '<br/>');

  return (
    <div className={className}>
      <div className="safe">
        <div className="bubble-box">
          {!value ? null : (
            <>
              <div className="triangle" />
              <div
                className="bubble"
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ShareInformation = (props) => {
  const [previewText, setPreviewText] = useState('');
  const [editText, setEditText] = useState('');
  const { query } = history.location;
  const {
    groupon: { shareInformation },
    dispatch,
  } = props;

  useEffect(() => {
    setPreviewText(editText);
  }, [editText]);

  useEffect(() => {
    setPreviewText(shareInformation);
    setEditText(shareInformation);
  }, [shareInformation]);

  useEffect(() => {
    dispatch({
      type: 'groupon/findNoticeInfo',
      payload: { id: query.grouponId },
    });
  }, []);

  function save() {
    dispatch({
      type: 'groupon/saveNoticeInfo',
      payload: { id: query.grouponId, noticeInfo: editText },
      callback: () => {
        message.success('保存成功');
      },
    });
  }

  return (
    <PageHeaderWrapper title={<GrouponHeader />}>
      <Card title="推广文案">
        <div className={styles['share-information']}>
          <ShowArea className="show-area" value={previewText} />
          <TextEditArea
            className="text-edit-area"
            value={editText}
            onChange={setEditText}
            onSave={save}
          />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ groupon, loading }) => ({
  groupon,
  loading: loading.effects['groupon/findNoticeInfo'],
}))(ShareInformation);
