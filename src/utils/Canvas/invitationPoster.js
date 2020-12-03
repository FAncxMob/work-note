import config from '@/utils/config';
import { throwIfMissing } from '@/utils/type';
import Canvas from './Canvas';
import { getWxAppCodeUrl } from './services';
import { setCloudParam } from '../cloudParam';
/**
 * 绘制邀请海报
 *
 * @param {*} dom canvas
 * @param {*} data
 * @param {string} data.avatarUrl 海报标题头像
 * @param {string} data.nickName 海报标题用户名称
 */
export default async function (dom, data) {
  if (!dom) return throwIfMissing('dom');
  const missing = [];
  ['avatarUrl', 'nickName', 'userId'].forEach((p) => {
    if (typeof data[p] === 'undefined') missing.push(p);
  });
  if (missing.length > 0) return throwIfMissing(missing.join(','));

  const { avatarUrl, nickName, userId } = data;
  const posterWidth = 750;
  const posterHeight = 1000;
  const canvas = new Canvas({ dom, width: posterWidth, height: posterHeight });
  let cloudParamCode = setCloudParam({
    param: JSON.stringify({ path: 'pages/helpSell/apply/index', params: { recommendId: userId } }),
  });

  // 1.白色背景
  canvas.drawBg('#fff');

  // 2.用户头像
  await (async function () {
    const paddingTop = 68;
    const headImgW = 120;

    await canvas.drawRect({
      x: (posterWidth - headImgW) / 2,
      y: paddingTop,
      width: headImgW,
      height: headImgW,
      radius: headImgW / 2,
      image: {
        url: avatarUrl,
        filter: 'getBusWgHi',
      },
      border: {
        width: 1,
        color: '#ddd',
      },
    });
  })();

  // 3.文本
  await (async function () {
    const paddingTop1 = 210;
    const paddingTop2 = 256;
    const textWidth = 660;

    canvas.ctx.textAlign = 'center';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `38px normal`;
    canvas.ctx.fillStyle = '#333';
    const title = canvas.cutText(nickName, '邀请你', textWidth);
    canvas.ctx.fillText(title, posterWidth / 2, paddingTop1);
    canvas.ctx.fillText('来火品平台帮卖赚钱', posterWidth / 2, paddingTop2);
  })();

  // 4.横幅
  await (async function () {
    const height = 280;
    const circleW = 140;
    const paddingTop1 = 360;
    const paddingTop2 = paddingTop1 + 45;
    const paddingTop3 = paddingTop2 + circleW + 20;
    const paddingLeft1 = 140;
    const paddingLeft2 = 470;

    await canvas.drawRect({ x: 0, y: paddingTop1, width: posterWidth, height, bgc: '#f5f5f5' });
    await canvas.drawRect({
      x: paddingLeft1,
      y: paddingTop2,
      width: circleW,
      height: circleW,
      radius: circleW / 2,
      bgc: '#4e89ff',
      image: {
        url: 'https://image.tradedge.cn/bang.png',
      },
    });
    await canvas.drawRect({
      x: paddingLeft2,
      y: paddingTop2,
      width: circleW,
      height: circleW,
      radius: circleW / 2,
      bgc: '#4e89ff',
      image: {
        url: 'https://image.tradedge.cn/price.png',
      },
    });

    canvas.ctx.textAlign = 'center';
    canvas.ctx.textBaseline = 'top';
    canvas.ctx.font = `32px normal`;
    canvas.ctx.fillStyle = '#333';
    canvas.ctx.fillText('一键帮卖', paddingLeft1 + circleW / 2, paddingTop3);
    canvas.ctx.fillText('轻松赚钱', paddingLeft2 + circleW / 2, paddingTop3);
  })();

  // 4.小程序码
  await (async function () {
    const paddingTop = 708;
    const wxAppCodeW = 148;
    cloudParamCode = await cloudParamCode;
    const scene = encodeURIComponent(`cloudParamCode-${cloudParamCode}`);

    await canvas.drawImage({
      x: (posterWidth - wxAppCodeW) / 2,
      y: paddingTop,
      width: wxAppCodeW,
      height: wxAppCodeW,
      url: getWxAppCodeUrl({ appId: config.customerAppId, scene, is_hyaline: true }),
    });
  })();

  // 5.提示
  await (async function () {
    const paddingTop = 880;
    const textBoxWidth = 340;
    const textBoxHeight = 50;

    await canvas.drawRect({
      x: (posterWidth - textBoxWidth) / 2,
      y: paddingTop,
      width: textBoxWidth,
      height: textBoxHeight,
      radius: 10,
      bgc: '#f5f5f5',
    });

    canvas.ctx.textAlign = 'center';
    canvas.ctx.textBaseline = 'middle';
    canvas.ctx.font = `22px normal`;
    canvas.ctx.fillStyle = '#999';
    canvas.ctx.fillText(
      `长按识别小程序码，接受邀请`,
      posterWidth / 2,
      paddingTop + textBoxHeight / 2,
    );
  })();

  return canvas;
}
