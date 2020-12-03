import { getBaseCategoryList } from '@/services/goodsWarehouse';

class WarehouseCategory {
  #init = null;

  #list = null;

  async init() {
    if (this.#init !== null && this.#init.constructor === Promise) {
      return this.#init;
    }

    this.#init = new Promise((resolve, reject) => {
      (async () => {
        const data = await getBaseCategoryList().catch((err) => reject(err));
        this.#list = data;
        this.#init = null;
        resolve();
      })();
    });
    return this.#init;
  }

  async getList() {
    if (!this.#list) {
      await this.init();
    }
    return this.#list;
  }

  async refresh() {
    this.init();
  }
}

export default new WarehouseCategory();
