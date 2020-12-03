import { message } from 'antd';
import actionMap from '../../actionMap';

const handleStatusChange = ({ captainId, status, dispatch, reLoad }) => {
  dispatch({
    type: actionMap[status],
    payload: { captainId },
    callback: () => {
      close();
      message.success('操作成功');
      reLoad();
    },
  });
};

export function StatusChangeModalConfig({ captainId, status, dispatch, reLoad }) {
  // status: suspend 歇业(0), 启用(3) || closed 禁用(1) || open 上线(2)
  const obj = [
    {
      title: '歇业操作确认',
      content: '歇业后用户将无法选择该自提点进行下单，您确认该团长歇业吗?',
      onOk: () => handleStatusChange({ captainId, status: 'suspend', dispatch, reLoad }),
    },
    {
      title: '禁用操作确认',
      content: '您确定禁用该团长吗？',
      onOk: () => handleStatusChange({ captainId, status: 'closed', dispatch, reLoad }),
    },
    {
      title: '上线操作确认',
      content: '上线后用户即可选择该自提点进行下单，您确认该团长上线吗?',
      onOk: () => handleStatusChange({ captainId, status: 'open', dispatch, reLoad }),
    },
    {
      title: '启用操作确认',
      content: '您确定启用该团长吗？',
      onOk: () => handleStatusChange({ captainId, status: 'suspend', dispatch, reLoad }),
    },
  ];
  return obj[status];
}
