import { mul } from '@/utils/utils';

const inText = '收入';
const outText = '支出';
const inCardIcon = 'iconyinhangka2';
const fundColors = { in: 'red', out: 'green' };
// 流水交易类型(资产明细需要)
export function fundTypes(type = 'IncomeOrder', state) {
  if (!type) return {};
  switch (type) {
    case 'IncomeOrder':
      return {
        title: `订单`,
        color: fundColors.in,
        type: 'in',
      };
    case 'IncomeCommission':
      return {
        title: `帮卖佣金`,
        iconText: '帮',
        color: fundColors.in,
        type: 'in',
      };
    case 'IncomeInviteOrder':
      return {
        title: `推荐奖励`,
        iconText: '荐',
        color: fundColors.in,
        type: 'in',
      };
    case 'IncomePickupServiceFee':
      return {
        title: `配货佣金`,
        iconText: '配',
        color: fundColors.in,
        type: 'in',
      };
    // 支出
    case 'OutcomeCancel':
    case 'ExpendOrderCancel':
    case 'OutcomeRefund':
    case 'ExpendRefund':
      return {
        title: `退款`,
        iconText: '退',
        color: fundColors.out,
        type: 'out',
      };
    case 'OutcomeRefundInviteOrder':
      return {
        title: `退推荐奖励`,
        iconText: '退',
        color: fundColors.out,
        type: 'out',
      };
    case 'OutcomeRefundCommission':
      return {
        title: `退帮卖佣金`,
        iconText: '退',
        color: fundColors.out,
        type: 'out',
      };
    case 'OutcomeRefundPickupServiceFee':
      return {
        title: `退配货佣金`,
        iconText: '退',
        color: fundColors.out,
        type: 'out',
      };
    // 出账
    case 'OutcomeTransferBank':
    case 'ExpendTransferBank':
      return {
        title: `提现至银行卡`,
        icon: inCardIcon,
        color: fundColors.out,
        type: 'out',
      };
    case 'OutcomeTransferWeChat':
    case 'ExpendTransferWeChat':
      return {
        title: `提现至微信零钱`,
        icon: inCardIcon,
        color: fundColors.out,
        type: 'out',
      };
    default:
      return {};
  }
}
// 流水交易类型(资产明细需要)
export function frozenTypes(type) {
  if (!type) return {};
  switch (type) {
    case 'WaitForSettle':
      return {
        title: '订单未结算',
      };
    default:
      return {};
  }
}
// 分转为元
export function transformFenToYuan(fen) {
  if (isNaN(fen * 0.01) || fen < 0) return '0.00';
  return fen === 0 ? '0.00' : (fen / 100).toFixed(2);
}

// 元转为分
export function transformYuanToFen(val) {
  if (isNaN(val * 0.01) || val < 0) return '0';
  return val === 0 ? '0' : parseInt(mul(val, 100), 0);
}

// 账户名字中间*表示（第一个字*，后面显示）
export function encryptName(val) {
  val = val || '';
  return `*${val.substring(1, val.length)}`;
}
// 银行卡中间*表示(前4后3，中间*)
export function encryptCard(val) {
  val = val || '';
  let str = val.substring(0, 4);
  const len = val.length;
  const start = len % 4 === 0 ? len - 4 : len - 3; // 2222 **** **** **** 666 | 2222 **** **** 6666
  for (let i = 4; i < start; i++) {
    if (i % 4 === 0) {
      str += ' ';
    }
    str += '*';
  }

  return `${str} ${val.substring(start, len)}`;
}

// 银行卡转换 4位一空格
export function transferBank(val = '') {
  return val
    .trim()
    .replace(/\s/g, '')
    .replace(/[^\d]/g, '')
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}
