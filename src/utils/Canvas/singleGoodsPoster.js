import config from '@/utils/config';
import { throwIfMissing } from '@/utils/type';
import Canvas from './Canvas';
import { getWxAppCodeUrl } from './services';
import { setCloudParam } from '../cloudParam';

/**
 * 绘制私有帮卖海报
 *
 * @param {*} dom canvas
 * @param {*} data
 * @param {string} data.image 大图
 * @param {string} data.grouponId 团购id
 * @param {string} data.goodsName 商品名称
 * @param {string} data.goodsDesc 商品描述
 * @param {string} data.avatarUrl 海报标题头像
 * @param {string} data.nickName 海报标题用户名称
 * @param {string} data.priceText 商品价格描述
 */
export default async function (dom, data) {
  if (!dom) return throwIfMissing('dom');
  const missing = [];
  ['image', 'grouponId', 'goodsName', 'goodsDesc', 'avatarUrl', 'nickName', 'priceText'].forEach(
    (p) => {
      if (typeof data[p] === 'undefined') missing.push(p);
    },
  );
  if (missing.length > 0) return throwIfMissing(missing.join(','));

  const { image, grouponId, goodsName, goodsDesc, avatarUrl, nickName, priceText } = data;
  const posterWidth = 750;
  const posterHeight = 1334;
  const posterPaddingTop = 30;
  const posterPaddingLeft = 24;
  const canvas = new Canvas({ dom, width: posterWidth, height: posterHeight });
  const cloudParamCode = setCloudParam({
    param: JSON.stringify({ path: 'pages/groupon/detail/index', params: { id: grouponId } }),
  });

  // 1.白色背景
  canvas.drawBg('#fff');

  // 2.标题区域
  await (async function () {
    const headerImageW = 68;
    const headerImageH = 68;
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
    const titlePaddingTop = posterPaddingTop + 4;

    canvas.ctx.textAlign = 'left';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `32px bold`;
    canvas.ctx.fillStyle = '#333';

    const testList = canvas.parseText(nickName, textWidth);

    let topOffset = 16;

    if (testList.length > 1) {
      topOffset = 0;
    }

    canvas.drawMultiRowText(
      nickName,
      textWidth,
      titlePaddingLeft,
      titlePaddingTop + topOffset,
      30,
      2,
    );
  })();

  // 3.大图区域
  await (async function () {
    const imageW = 702;
    const imageH = 702;
    const imageMarginTop = 129;

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

    canvas.ctx.textAlign = 'left';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `40px bold`;
    canvas.ctx.fillStyle = '#ff4d4f';
    canvas.ctx.fillText(priceText, posterPaddingLeft, 860);

    let baseMarginTop = 918;
    canvas.ctx.fillStyle = '#333';

    baseMarginTop += canvas.drawMultiRowText(
      goodsName,
      textW,
      posterPaddingLeft,
      baseMarginTop,
      40,
      2,
    );
    baseMarginTop += 15;

    canvas.ctx.font = `30px normal`;
    canvas.ctx.fillStyle = '#999';

    canvas.drawMultiRowText(goodsDesc, textW, posterPaddingLeft, baseMarginTop, 30, 2);
  })();

  // 5. 绘制底部区域
  await (async function () {
    canvas.ctx.textAlign = 'left';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `40px bold`;
    canvas.ctx.fillStyle = '#ff4d4f';

    canvas.drawRect({
      x: posterPaddingLeft,
      y: 1184,
      width: 448,
      height: 64,
      radius: 10,
      bgc: '#f5f5f5',
    });
    canvas.drawTriangle({ x: 478, y: 1207 + 9, height: 18, bgc: '#f5f5f5', direction: 'right' });

    canvas.ctx.font = `28px normal`;
    canvas.ctx.fillStyle = '#999';
    canvas.ctx.fillText(`长按识别小程序 快来下单享优惠`, posterPaddingLeft + 20, 1184 + 20);
  })();

  // 6.小程序码
  await (async function () {
    const cloudParamCodeUrl = await cloudParamCode;
    const scene = encodeURIComponent(`cloudParamCode-${cloudParamCodeUrl}`);

    await canvas.drawImage({
      x: 526,
      y: 1110,
      width: 200,
      height: 200,
      url: getWxAppCodeUrl({ appId: config.customerAppId, scene, is_hyaline: true }),
    });
  })();

  return canvas;
}
