import { throwIfMissing } from '@/utils/type';
import config from '@/utils/config';
import { getWxAppCodeUrl } from './services';
import Canvas from './Canvas';
import { setCloudParam } from '../cloudParam';

/**
 * 绘制平台帮卖海报
 *
 * @param {*} dom canvas
 * @param {*} data
 * @param {string} data.date 日期
 * @param {number} data.priceText 金额文案
 * @param {string} data.image 大图
 * @param {string} data.grouponId 团购id
 * @param {string} data.grouponTitle 团购标题
 * @param {string} data.grouponDesc 团购描述
 * @param {string} data.avatarUrl 海报标题头像
 * @param {string} data.nickName 海报标题用户名称
 */
export default async function (dom, data) {
  if (!dom) return throwIfMissing('dom');
  const missing = [];
  [
    'date',
    'image',
    'priceText',
    'grouponId',
    'grouponTitle',
    'grouponDesc',
    'avatarUrl',
    'nickName',
    'userId',
  ].forEach((p) => {
    if (typeof data[p] === 'undefined') missing.push(p);
  });
  if (missing.length > 0) return throwIfMissing(missing.join(','));

  const {
    date,
    image,
    priceText,
    grouponId,
    grouponTitle,
    grouponDesc,
    avatarUrl,
    nickName,
    userId,
  } = data;
  const posterWidth = 750;
  const posterHeight = 1334;
  const posterPaddingTop = 24;
  const posterPaddingLeft = 24;
  const canvas = new Canvas({ dom, width: posterWidth, height: posterHeight });
  let cloudParamCode = setCloudParam({
    param: JSON.stringify({ path: 'groupDetail', params: { id: grouponId, helpSellId: userId } }),
  });

  // 1.白色背景
  canvas.drawBg('#fff');

  // 2.标题区域
  await (async function () {
    const headerImageW = 92;
    const headerImageH = 92;
    const textWidth = 585;

    await canvas.drawRect({
      x: posterPaddingLeft,
      y: posterPaddingTop,
      width: headerImageW,
      height: headerImageH,
      radius: 10,
      image: {
        url: avatarUrl,
        filter: 'getPosterHi',
      },
      border: {
        width: 1,
        color: '#dddddd',
      },
    });

    const titlePaddingLeft = posterPaddingLeft + headerImageW + 24;
    const titlePaddingTop = posterPaddingTop + 8;

    canvas.ctx.textAlign = 'left';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `38px bold`;
    canvas.ctx.fillStyle = '#333';
    const title = canvas.cutText(nickName, '邀请你帮卖TA的团', textWidth);
    canvas.ctx.fillText(title, titlePaddingLeft, titlePaddingTop);

    const datePaddingTop = posterPaddingTop + 64;
    canvas.ctx.font = `26px normal`;
    canvas.ctx.fillStyle = '#999';
    canvas.ctx.fillText(date, titlePaddingLeft, datePaddingTop);
  })();

  // 3.大图区域
  await (async function () {
    const imageW = 702;
    const imageH = 702;
    const imageMarginTop = 140;

    await canvas.drawRect({
      x: posterPaddingLeft,
      y: imageMarginTop,
      width: imageW,
      height: imageH,
      radius: 10,
      image: {
        url: image,
        filter: 'getPosterP',
      },
      border: {
        width: 1,
        color: '#dddddd',
      },
    });
  })();

  // 4.文案区域
  await (async function () {
    const textW = 702;
    let baseMarginTop = 866;

    canvas.ctx.textAlign = 'left';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `40px bold`;
    canvas.ctx.fillStyle = '#333';
    baseMarginTop += canvas.drawMultiRowText(
      grouponTitle,
      textW,
      posterPaddingLeft,
      baseMarginTop,
      40,
      2,
    );
    baseMarginTop += 15;

    canvas.ctx.font = `30px normal`;
    canvas.ctx.fillStyle = '#999';
    canvas.drawMultiRowText(grouponDesc, textW, posterPaddingLeft, baseMarginTop, 30, 2);
  })();

  // 5. 绘制底部区域
  await (async function () {
    canvas.ctx.textAlign = 'left';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `40px bold`;
    canvas.ctx.fillStyle = '#ff4d4f';
    canvas.ctx.fillText(`${priceText}元`, posterPaddingLeft, 1152);

    canvas.drawRect({
      x: posterPaddingLeft,
      y: 1218,
      width: 356,
      height: 64,
      radius: 10,
      bgc: '#f5f5f5',
    });
    canvas.drawTriangle({ x: 386, y: 1250, height: 18, bgc: '#f5f5f5', direction: 'right' });

    canvas.ctx.font = `28px normal`;
    canvas.ctx.fillStyle = '#999';
    canvas.ctx.fillText(`长按识别小程序 跟团购买`, posterPaddingLeft + 20, 1218 + 20);
  })();

  // 6.小程序码
  await (async function () {
    cloudParamCode = await cloudParamCode;
    const scene = encodeURIComponent(`cloudParamCode-${cloudParamCode}`);

    await canvas.drawImage({
      x: 526,
      y: 1110,
      width: 200,
      height: 200,
      url: getWxAppCodeUrl({ appId: config.merchantAppId, scene, is_hyaline: true }),
    });
  })();

  return canvas;
}
