import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Descriptions, Tag } from 'antd';

import { formatData } from '../utils';

import styles from '../index.less';

const { Item } = Descriptions;

const deliveryMap = ['配送到家', '门店自提'];
const statusMap = [
  { text: '未开始', color: 'gold' },
  { text: '进行中', color: 'green' },
  { text: '已结束', color: '' },
];

const grouponInfoMap = [
  { label: '团购名称', key: 'title', value: '' },
  { label: '开始时间', key: 'startTime', value: '' },
  { label: '结束时间', key: 'endTime', value: '' },
  { label: '配送方式', key: 'deliveryType', value: '', formatFn: (value) => deliveryMap[value] },
  {
    label: '团购状态',
    key: 'status',
    value: '',
    formatFn: (value) => <Tag color={statusMap[value].color}>{statusMap[value].text}</Tag>,
  },
];

const GrouponHeader = (props) => {
  const [grouponFormatInfo, setGrouponFormatInfo] = useState(grouponInfoMap);
  const { query } = history.location;
  const { dispatch, grouponId } = props;

  useEffect(() => {
    dispatch({
      type: 'groupon/getGroupInfo',
      payload: { groupbuyingId: query.grouponId || grouponId },
      callback: (res) => {
        setGrouponFormatInfo(formatData(res, grouponInfoMap));
      },
    });
  }, []);

  return (
    <Descriptions
      title="团购基本信息"
      size="small"
      className={styles.headerDescriptions}
      column={{ xs: 1, sm: 2, md: 4 }}
    >
      {grouponFormatInfo.map(({ label, key, value }) => (
        <Item label={label} key={key}>
          {value}
        </Item>
      ))}
    </Descriptions>
  );
};

export default connect(({ grouponData }) => ({
  grouponData,
}))(GrouponHeader);
