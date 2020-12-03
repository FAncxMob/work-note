import React from 'react';
import ReactDOM from 'react-dom';
import ChooseClassModal from './ChooseTagsModal.jsx';

export default {
  /**
   * @param {*} param
   * @param {*}  param.classes 已选的分类id数组
   * @param {*} param.onSelect 点击确定的回调，参数是已选中的分类id数组
   */
  open({ classes = [], onSelect = () => {} }) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const destroy = () => {
      ReactDOM.unmountComponentAtNode(div);
    };

    ReactDOM.render(
      <ChooseClassModal onSelect={onSelect} classes={classes} onClose={destroy} />,
      div,
    );
    return destroy;
  },
};
