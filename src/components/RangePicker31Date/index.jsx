/* eslint-disable prettier/prettier */
import React, { PureComponent } from 'react'

import { DatePicker } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const utils = require('@/utils/utils')

export default class RangePicker31Date extends PureComponent {
  handleDateChange = dates => {
    const { onChange } = this.props
    const { date } = utils.getSomeDate(dates)
    if(onChange) onChange(date)
  }

  render () {
    const { showTime, value, width="100%", noDisabled } = this.props
    const format = showTime ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD'
    return (
      <RangePicker
        style={{ width }}
        allowClear={false}
        onChange={this.handleDateChange}
        value={value}
        format={format}
        showTime={showTime}
        disabledDate={current => {
          if(noDisabled) return null
          return !current.isBefore(
            moment()
              .add(1, 'days')
              .format(format)
          )
        }}
        ranges={{ 今天: utils.today(), 最近7天: utils.last7days(), 最近30天: utils.last30days() }}
      />
    )
  }
}
