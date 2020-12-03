import { message, Modal } from 'antd';
import UFF from '@/utils/UFF';
import { beforeUpload } from '@/utils/beforeUpload';

class FileHandle {
  #this = null;

  setThis(_this) {
    this.#this = _this;
  }

  /**
   * 文件状态改变
   * @param {Object} file 组件回调参数
   * @param {*} attrName 移除回调要改变的state数据属性名字
   * @param {*} name 移除回调要改变的数据源里的字段名
   * @param {*} index 移除回调要改变的数据源是array时，要操作的下标
   */
  handleUpChange({ fileList }, attrName, name, index) {
    try {
      if (index !== undefined) {
        this.#this.setState((state) => {
          state[attrName][index][name] = fileList;
          return state;
        });
      } else {
        this.#this.setState((state) => {
          state[attrName][name] = fileList;
          return state;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 上传图片回调
   * @param {Object} e 组件回调参数
   * @param {*} attrName 移除回调要改变的state数据属性名字
   * @param {*} name 回调要改变的数据源里的字段名
   * @param {*} index 回调要改变的数据源是array时，要操作的下标
   */
  handleSuccess(res, attrName, name, index) {
    try {
      if (res.sub_code === 'ok') {
        const arr = this.#this.state[attrName];
        const type = name;
        const { filePath, fileUrl } = res.data;
        if (index !== undefined) {
          arr[index][name] = [{ url: fileUrl, subUrl: filePath, uid: 0, sourceType: type }];
        } else {
          let url = fileUrl;
          if (name === 'video') {
            url = UFF.getVideoImg(fileUrl, 86, 86);
          }
          // 先删除handleUpChange添加的元素
          arr[name].pop();
          arr[name].push({ url, subUrl: filePath, uid: arr[name].length, sourceType: type });
        }
        this.#this.setState((state) => {
          state[attrName] = arr;
          return state;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 移除文件
   * @param {Object} e 组件回调参数
   * @param {*} attrName 移除回调要改变的state数据属性名字
   * @param {*} name 移除回调要改变的数据源里的字段名
   * @param {*} index 移除回调要改变的数据源是array时，要操作的下标
   */
  async handleRemove(file, attrName, name, index) {
    const arr = this.#this.state[attrName];
    if (index !== undefined) {
      arr[index][name] = [];
    } else {
      arr[name].splice(file.uid, 1);
    }
    this.#this.setState((state) => {
      state[attrName] = arr;
      return state;
    });
  }
}
const fileHandle = new FileHandle();
fileHandle.beforeUpload = beforeUpload;

fileHandle.asyncModal = function () {
  const { confirm } = Modal;
  return new Promise((res, rej) => {
    confirm({
      title: '确认要移除图片吗',
      content: '移除图片后，记得要点击保存按钮哦',
      onCancel: () => {
        res(false);
      },
      onOk: () => {
        res(true);
      },
    });
  });
};

export default fileHandle;
