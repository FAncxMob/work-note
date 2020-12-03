import { throwError } from '@/utils/error';
import { message } from 'antd';
import { isType, throwIfMissing } from '@/utils/type';
/**
 *
 * @param {*} file 文件对象
 * @param {object | Function} fileOption object时，{type：'video'|'image'|undefined,size:number类型|undefined};Function 返回类型参照ant design的beforeUpload类型
 */
// 上传前拦截
export const beforeUpload = async (file, fileOption = throwIfMissing('fileOption')) => {
  try {
    if (isType(fileOption, 'function')) {
      return fileOption(file);
    }
    // 传入的beforeUpload非函数是，应该是对象
    const { type = 'all', size } = fileOption;
    if (type === 'video') {
      if (!/^video\//.test(file.type)) {
        message.warn('只能上传视频类文件');
        throwError('停止上传文件');
      }
      const res = await this.checkVideoTime(file);
      if (res > (size || 60)) {
        message.warn('上传视频时长不能超过60S');
        throwError('停止上传文件');
      }
    }
    if (type === 'image') {
      if (!/^image\//.test(file.type)) {
        message.warn('只能上传图片类文件');
        throwError('停止上传文件');
      }
      if (!/\.(?:jpg|png|gif|jpeg)$/.test(file.name)) {
        message.warn('上传图片类型错误，仅支持jpg、png、gif类型图片');
        throwError('停止上传文件');
      }
      const fileSize = (size || 5) * 1024 * 1024; // 5mb
      if (file.size > fileSize) {
        message.warn(`上传图片不能超过${size || 5}Mb`);
        throwError('停止上传文件');
      }
    }
    return Promise.resolve(file);
  } catch (error) {
    return Promise.reject(error.message);
  }
};

// 监听视频时长
function checkVideoTime(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      const audioElement = new Audio(fileUrl);
      let duration;
      audioElement.addEventListener('loadedmetadata', function (_event) {
        duration = audioElement.duration;
        resolve(duration);
      });
    } catch (error) {
      reject(false);
    }
  });
}
