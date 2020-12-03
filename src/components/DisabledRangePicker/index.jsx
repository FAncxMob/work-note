/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { RangePicker } from 'antd';
import moment from 'moment';

const DisabledRangePicker = (props) => {
  const { showTime = { format: 'HH:mm' }, format = 'YYYY-MM-DD HH:mm' } = props;
  function disabledDate(current) {}
  function disabledRangeTime(_, type) {}
  return (
    <RangePicker
      disabledDate={disabledDate}
      disabledTime={disabledRangeTime}
      showTime={showTime}
      format={format}
    />
  );
};

export default DisabledRangePicker;
