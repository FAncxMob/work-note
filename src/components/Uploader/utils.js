import { filterSource } from '@/utils/utils';

const EXIF = require('exif-js');

let TempCanvas = null;

function dataURLtoFile(dataUrl, filename = 'file') {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const suffix = mime.split('/')[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, { type: mime });
}

export function adjustImageFile({ imageFile, imageWidth, imageHeight }) {
  if (!imageFile) return Promise.reject(new Error('imageFile is not valid'));

  return new Promise((resolve) => {
    EXIF.getData(imageFile, () => {
      // 先获取方向
      const Orientation = EXIF.getTag(this, 'Orientation');

      // 因为是在回调函数里设置orientation的值，所以要在回调成功后再读取图片，保持同步
      const reader = new FileReader();
      const image = new Image();

      reader.onload = (ev) => {
        // 读取文件
        image.onload = () => {
          // 加载照片
          let imgWidth = this.width;
          let imgHeight = this.height;
          // 控制上传图片的宽高
          if (imgWidth > imgHeight && imgWidth > imageWidth) {
            imgWidth = imageWidth;
            imgHeight = Math.ceil((imageWidth * this.height) / this.width);
          } else if (imgWidth < imgHeight && imgHeight > imageHeight) {
            imgWidth = Math.ceil((imageHeight * this.width) / this.height);
            imgHeight = imageHeight;
          }

          let canvas = TempCanvas;
          if (!canvas) {
            canvas = document.createElement('canvas');
            TempCanvas = canvas;
          }
          const ctx = canvas.getContext('2d');
          canvas.width = imgWidth;
          canvas.height = imgHeight;

          if (Orientation && Orientation !== 1) {
            switch (Orientation) {
              case 6: // 旋转90度
                canvas.width = imgHeight;
                canvas.height = imgWidth;
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
                break;
              case 3: // 旋转180度
                ctx.rotate(Math.PI);
                ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
                break;
              case 8: // 旋转-90度
                canvas.width = imgHeight;
                canvas.height = imgWidth;
                ctx.rotate((3 * Math.PI) / 2);
                ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
                break;
              default:
            }
          } else {
            ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
          }
          const imgBase64 = canvas.toDataURL('image/jpeg', 0.8);
          const imgFile = dataURLtoFile(
            imgBase64,
            imageFile.name.slice(0, imageFile.name.lastIndexOf('.')),
          );
          resolve(imgFile);
        };
        image.src = ev.target.result;
      };
      reader.readAsDataURL(imageFile);
    });
  });
}

export function getImageUrl(imageName) {
  return filterSource(imageName);
}
