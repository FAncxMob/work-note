import React from 'react';
import ReactDOM from 'react-dom';
import ChooseClassModal from './VerifyModal.jsx';

const P = {}; // 保存Promise的resolve和reject方法

const destroy = (div) => {
  ReactDOM.unmountComponentAtNode(div);
};

function callBack(action) {
  P.resolve(action);
}

function VerifyModal(props = {}) {
  const { captainId = '', reLoad = '', dispatch } = props;

  const div = document.createElement('div');
  document.body.appendChild(div);

  ReactDOM.render(
    <ChooseClassModal
      dispatch={dispatch}
      reLoad={reLoad}
      callBack={callBack}
      captainId={captainId}
      onClose={() => destroy(div)}
    />,
    div,
  );

  return new Promise((resolve) => {
    P.resolve = resolve;
  });
}

export default VerifyModal;
