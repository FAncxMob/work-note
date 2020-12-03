import { throwIfMissing, isEmptyObject, isType } from '@/utils/type';
import UFF from '@/utils/UFF';

const drawRect = Symbol('drawRect');
const createImage = Symbol('createImage');

class Canvas {
  ctx; // 绘制上下文

  canvas; // 画布对象

  constructor({ dom = throwIfMissing('dom'), width, height }) {
    const canvas = dom;
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  /**
   * 保存至相册
   */

  async saveFileToAlbum(name = '') {
    const url = this.canvas.toDataURL('image/png');
    const oA = document.createElement('a');
    oA.download = name; // 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
  }

  /**
   * 绘制图片
   *
   * @param {*} image
   * @param {number} image.x x轴
   * @param {number} image.y y轴
   * @param {number} image.width 宽度
   * @param {number} image.height 高度
   * @param {string} image.url 地址
   * @param {Function} image.filter 地址过滤器
   */
  async drawImage({ x, y, width, height, url, filter }) {
    const imageItem = await this[createImage](url, filter);
    this.ctx.drawImage(imageItem, x, y, width, height);
  }

  /**
   * 绘制圆角背景
   *
   * @param {*} radius 圆角尺寸
   */
  drawBg(color, radius = 0) {
    const x = 0;
    const y = 0;
    const { width } = this;
    const { height } = this;

    this[drawRect](x, y, width, height, radius);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }

  /**
   * 绘制圆角盒子
   *
   * @param {*} param
   * @param {number} param.x x轴
   * @param {number} param.y y轴
   * @param {number} param.width 盒子宽度
   * @param {number} param.height 盒子高度
   * @param {number} [param.radius] 圆角尺寸
   * @param {string} [param.bgc] 背景色
   * @param {*} [param.image] 背景图
   * @param {string} param.image.url 图片地址
   * @param {Function} param.image.filter 图片地址过滤器
   * @param {*} [param.border] 边框
   * @param {number} param.border.width 边框宽度
   * @param {string} param.border.color 边框颜色
   */
  async drawRect({ x, y, width, height, radius = 0, bgc, image = {}, border = {} }) {
    this[drawRect](x, y, width, height, radius);

    if (bgc) {
      this.ctx.fillStyle = bgc;
      this.ctx.fillRect(x, y, width, height);
    }

    if (!isEmptyObject(image)) {
      const { url, filter } = image;
      const imageItem = await this[createImage](url, filter);
      this.ctx.drawImage(imageItem, x, y, width, height);
    }

    if (!isEmptyObject(border)) {
      const { width: lineWidth, color } = border;
      this.ctx.lineWidth = lineWidth * 2; // TODO 该处暂时把系数*2，原因是在实际渲染的时候只有一半的数值，猜测是因为线条的中线问题，时间紧迫就没有去细研究了 by肖飞
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * 截取文本
   *
   * @param {string} dynamic 动态文本
   * @param {string} fixed 固定文本
   * @param {number} textWidth 文本区域宽度
   * @param {boolean} [force] 强制省略号
   */
  cutText(dynamic, fixed, textWidth, force = false) {
    const fixedText = fixed;
    const fixedTextWidth = this.ctx.measureText(fixedText).width;
    let text = force ? `${dynamic}…` : dynamic;

    while (this.ctx.measureText(text).width + fixedTextWidth > textWidth) {
      text = `${text.slice(0, text.length - 2)}…`;
    }

    return text + fixedText;
  }

  /**
   * 转换为多行文本
   *
   * @description 根据文本宽度把单行文本转换为多行文本
   * @param {*} text 文本
   * @param {*} textWidth 文本区域宽度
   */
  parseText(text, textWidth) {
    const len = text.length;
    const res = [];
    let start = 0;
    let index = 0;

    while (index <= len) {
      if (this.ctx.measureText(text.slice(start, index)).width < textWidth) {
        if (index === len) res.push(text.slice(start, index));
        index++;
      } else {
        index--;
        res.push(text.slice(start, index));
        start = index;
      }
    }

    return res;
  }

  /**
   * 绘制多行文本
   *
   * @description 根据文本宽度把单行文本转换为多行文本
   * @param {string} text 文本
   * @param {number} textWidth 文本区域宽度
   * @param {*} x x轴
   * @param {*} y y轴
   * @param {*} fz 字体尺寸
   * @param {*} [row] 显示行数
   * @returns 返回渲染后文本占据的高度
   */
  drawMultiRowText(text, textWidth, x, y, fz, row = Number.POSITIVE_INFINITY) {
    const textArr = this.parseText(text, textWidth);
    // const lineHeight = this.ctx.measureText(textArr[0]).emHeightDescent * 1.2
    const lineHeight = fz * 1.2;
    let current = 0;
    row = textArr.length > row ? row : textArr.length;

    while (current < row) {
      let renderText = textArr[current];

      if (current === row - 1) {
        renderText = this.cutText(renderText, '', textWidth, textArr.length > row);
      }

      this.ctx.fillText(renderText, x, y + current * lineHeight);
      current++;
    }

    return lineHeight * row;
  }

  /**
   * 绘制三角形
   *
   * @param {number} param.x x轴
   * @param {number} param.y y轴
   * @param {number} param.height 高度
   * @param {string} param.bgc 背景色
   * @param {string} [param.direction] 方向 top | bottom | left | right
   * @param {*} [param.image] 背景图
   * @param {*} param.image.url 图片地址
   * @param {*} param.image.filter 图片地址过滤器
   * @param {*} [param.border] 边框
   * @param {*} param.border.width 边框宽度
   * @param {*} param.border.color 边框颜色
   */
  async drawTriangle({ x, y, height, bgc, direction = 'top', image = {}, border = {} }) {
    let deg;

    switch (direction) {
      case 'top':
        deg = 0;
        break;
      case 'bottom':
        deg = 180;
        break;
      case 'left':
        deg = 270;
        break;
      case 'right':
        deg = 90;
        break;
      default:
        deg = 0;
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(x, y);
    this.ctx.rotate((Math.PI / 180) * deg);
    this.ctx.translate(-x, -y);
    this.ctx.moveTo(x, y - (height * 2) / 3);
    this.ctx.lineTo(x + height / Math.sqrt(3), y + height / 3);
    this.ctx.lineTo(x - height / Math.sqrt(3), y + height / 3);
    this.ctx.lineTo(x, y - (height * 2) / 3);
    this.ctx.closePath();
    this.ctx.clip();

    if (bgc) {
      this.ctx.fillStyle = bgc;
      this.ctx.fill();
    }

    if (!isEmptyObject(image)) {
      const { url, filter } = image;
      const imageItem = await this[createImage](url, filter);
      this.ctx.drawImage(
        imageItem,
        x - height / Math.sqrt(3),
        y - (height * 2) / 3,
        x + height / Math.sqrt(3) - (x - height / Math.sqrt(3)),
        height,
      );
    }

    if (!isEmptyObject(border)) {
      const { width: lineWidth, color } = border;
      this.ctx.lineWidth = lineWidth * 2; // TODO 该处暂时把系数*2，原因是在实际渲染的时候只有一半的数值，猜测是因为线条的中线问题，时间紧迫就没有去细研究了 by肖飞
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  [drawRect](x, y, width, height, r) {
    let ltR;
    let rtR;
    let rbR;
    let lbR;
    if (isType(r, 'number')) {
      ltR = r;
      rtR = r;
      rbR = r;
      lbR = r;
    } else if (isType(r, 'string')) {
      const rs = r
        .split(' ')
        .filter((i) => i !== ' ')
        .map((i) => i * 1);
      switch (rs.length) {
        case 4:
          [ltR, rtR, rbR, lbR] = rs;
          break;
        case 3:
          [ltR, rtR, rbR] = rs;
          lbR = rtR;
          break;
        case 2:
          [ltR, rtR] = rs;
          [rbR, lbR] = rs;
          break;
        case 1:
        default:
          [ltR] = rs;
          rtR = ltR;
          rbR = ltR;
          lbR = ltR;
      }
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x + ltR, y);
    // 右上
    this.ctx.arcTo(x + width, y, x + width, y + rtR, rtR);
    // 右下
    this.ctx.arcTo(x + width, y + height, x + width - rbR, y + height, rbR);
    // 左下
    this.ctx.arcTo(x, y + height, x, y + height - lbR, lbR);
    // 左上
    this.ctx.arcTo(x, y, x + ltR, y, ltR);
    this.ctx.clip();
  }

  // eslint-disable-next-line class-methods-use-this
  [createImage](url, filter) {
    const src = filter ? UFF[filter](url) : url;
    // const image = this.canvas.createImageData();
    const image = new Image();
    // image.setAttribute('crossOrigin', 'use-credentials');
    image.crossOrigin = '';
    image.src = src;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (e) => reject(e);
    });
  }
}

export default Canvas;
