import request from '@/utils/request';

const BASE_ROUTE = 'account/';

// 获取首页资金相关的数据
async function getTotalAndLockFee(param) {
  const res = await request.get(`${BASE_ROUTE}account/data`, { query: param });
  // const res = { totalAmount: 6000, lockAmount: 100 };
  // console.log('info', param, res);
  return res;
}

// 查询资产明细
async function queryAssetDetails(param = {}) {
  const res = await request.get(`${BASE_ROUTE}account/page/flow`, { query: param });

  return res;
}
// 查询冻结金额明细
async function queryFreezeDetail(param = {}) {
  const res = await request.get(`${BASE_ROUTE}account/page/freeze/detail`, { query: param });
  return res;
}
// 添加银行卡
async function saveBankAccount(param) {
  const res = await request.post(`${BASE_ROUTE}bank/add`, {
    body: param,
    role: { require: ['owner', 'cardNo'] },
  });
  return res;
}

// 删除银行卡
async function delBankAccount(param) {
  const res = await request.post(`${BASE_ROUTE}bank/delete`, {
    body: param,
    role: { require: ['id'] },
  });
  return res;
}

// 银行卡开户行地址模糊查询（左连接模糊）
async function searchChannels(value) {
  const res = await request.get(`${BASE_ROUTE}bank/channels`, {
    query: { name: value },
    queryRole: { require: ['name'] },
  });
  return res;
}

// 查询提现账户信息
async function getAccountList(param) {
  const res = await request.get(`${BASE_ROUTE}bank/list`, { query: param });
  return res;
}
// 查询默认银行卡
async function getDefaultBankCard(param) {
  const res = await request.get(`${BASE_ROUTE}bank/default`, { query: param });
  return res;
}
// 查询默认银行卡
async function getBankNameByCardNo(param) {
  const res = await request.get(`${BASE_ROUTE}bank/cardno`, {
    query: param,
    queryRole: { require: ['cardNo'] },
  });
  return res;
}

// 申请提现到小程序
async function applyWithdrawalToWX(param = {}) {
  const res = await request.get(`${BASE_ROUTE}transfer/wechat/request`, {
    query: param,
    queryRole: { require: ['amount', 'app_id'] },
  });
  return res;
}

// 申请提现到银行
async function applyWithdrawalToBank(param) {
  const res = await request.get(`${BASE_ROUTE}transfer/bank/request`, {
    query: param,
    queryRole: { require: ['amount', 'bankId'] },
  });
  return res;
}

// 更新账户
async function updateBankAccount(param) {
  const res = await request.post(`${BASE_ROUTE}bank/update`, {
    body: param,
    role: { require: ['id', 'address', 'channelNo'] },
  });
  return res;
}

export default {
  queryFreezeDetail,
  queryAssetDetails,
  applyWithdrawalToBank,
  applyWithdrawalToWX,
  getAccountList,
  getDefaultBankCard,
  getBankNameByCardNo,
  updateBankAccount,
  saveBankAccount,
  delBankAccount,
  searchChannels,
  getTotalAndLockFee,
};
