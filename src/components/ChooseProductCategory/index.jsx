import React from 'react';
import ReactDOM from 'react-dom';
import ChooseModal from './ChooseModal.jsx';

const P = {}; // 保存Promise的resolve和reject方法

const destroy = (div) => {
  ReactDOM.unmountComponentAtNode(div);
};

function callBack(action) {
  P.resolve(action);
}

function ChooseCategory(props = {}) {
  const { categoryIds = [] } = props;

  const div = document.createElement('div');
  document.body.appendChild(div);

  ReactDOM.render(
    <ChooseModal callBack={callBack} categoryIds={categoryIds} onClose={() => destroy(div)} />,
    div,
  );

  return new Promise((resolve) => {
    P.resolve = resolve;
  });
}

export default ChooseCategory;
