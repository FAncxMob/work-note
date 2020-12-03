import React from 'react';
import { message, Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { guideTypeData, skuItem } from './init';
import { getSkusTableByRecursion, isNumbers, getCommission } from './utils';
import { validator } from './submit';

// 确认批量设置数据
export function setTableAllData(_this) {
  try {
    const { skusTableList } = _this.state;
    if (skusTableList.length < 1) return message.warn('请先添加规格');
    if (_this.settingTableType !== 4 || _this.settingTableType !== 3) {
      if (!validator(_this.settingTableTypeValue)) return false;
    }
    let attrName = 'supplyPrice';
    switch (_this.settingTableType) {
      case 0: // 设置供货价
        attrName = 'supplyPrice';
        break;
      case 1: // 批量设置建议售价
        attrName = 'suggestPrice';
        break;
      case 2: // 批量设置市场价
        attrName = 'marketPrice';
        break;
      case 3: // 批量设置库存
        attrName = 'stock';
        if (!isNumbers(_this.settingTableTypeValue))
          return message.warn('库存设置不正确，请输入正确的值');
        break;
      case 4: // 批量设置商品条码
        attrName = 'barcode';
        break;
      case 5: // 批量设置重量
        attrName = 'weight';
        break;
      case 6: // 批量设置体积
        attrName = 'volume';
        break;
      default:
    }
    skusTableList.forEach((item) => {
      item[attrName] = _this.settingTableTypeValue;
    });
    _this.setState({
      skusTableList,
    });
  } catch (error) {
    console.log(error);
  }
}

// 添加规格
export function addMultiGuide(i, _this) {
  try {
    const { skusType, skusTableList } = _this.state;
    const { skus } = skusType[i];
    skus.push(skuItem());
    getSkusTableByRecursion(skusTableList, skusType[0], skusType[1]);
    _this.setState({
      skusType,
      skusTableList,
    });
  } catch (error) {
    console.log(error);
  }
}

// 删除规格
export function minusMultiGuide(i, i2, data, l, _this) {
  try {
    if (l === 1) return message.error('具体规格至少保留一个');
    const { skusType, skusTableList } = _this.state;
    skusType[i].skus.splice(i2, 1);
    // skusTableList = [];
    getSkusTableByRecursion(skusTableList, skusType[0], skusType[1]);
    _this.setState({
      skusType,
      skusTableList,
    });
  } catch (error) {
    console.log(error);
  }
}

// 删除规格分类
export function minusMultiGuideType(i, _this) {
  try {
    let { skusType, skusTableList } = _this.state;
    skusType.splice(i, 1);
    skusTableList = [];
    upDataStates(skusType, skusTableList, _this);
  } catch (error) {
    console.log(error);
  }
}

// 添加规格分类
export function addGuideType(_this) {
  const { skusType, skusTableList } = _this.state;
  skusType.push(guideTypeData());
  upDataStates(skusType, skusTableList, _this);
}

// 修改数据
export function upDataStates(skusType, skusTableList, _this) {
  try {
    const newColumns = _this.skusTableConcatData(skusType);
    getSkusTableByRecursion(skusTableList, skusType[0], skusType[1]);
    _this.setState({
      skusType,
      columns: newColumns,
      skusTableList,
    });
  } catch (error) {
    console.log(error);
  }
}

// 单规格
export function simpleGuide(_this) {
  const {
    sales, // 零售价
    // supplyPrice, // 供货价
    // suggestPrice, // 建议零售价
    marketPrice, // 划线价
    barcode, // 商品条码
    weight, // 重量
    volume, // 体积
    stock, // 库存
  } = _this.state.details;
  return (
    <>
      <Form.Item label="规格">
        <Button
          type="primary"
          onClick={() => {
            _this.changeGuide();
          }}
          icon={<PlusOutlined className="fz16" />}
        >
          规格
        </Button>
      </Form.Item>

      {/* <Form.Item label="供货价" className="detail-rule">
        <Input
          prefix="￥"
          className="w430"
          value={supplyPrice}
          onInput={(e) => {
            _this.formInput(e, 'supplyPrice', '供货价');
          }}
          placeholder="请输入供货价"
          maxLength={100000000}
        />
        <p className="mb5 ml10 dib">平台佣金：¥{getCommission(supplyPrice, _this)}</p>
      </Form.Item> */}

      {/* <Form.Item label="建议售价" className="detail-rule">
        <Input
          prefix="￥"
          value={suggestPrice}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'suggestPrice', '建议售价');
          }}
          placeholder="请输入建议售价,必须大于供货价"
          maxLength={100000000}
        />
      </Form.Item> */}
      <Form.Item label="划线价">
        <Input
          prefix="￥"
          value={marketPrice}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'marketPrice', '划线价');
          }}
          placeholder="请输入建议划线价"
          maxLength={100000000}
        />
      </Form.Item>

      <Form.Item label="零售价" className="detail-rule">
        <Input
          prefix="￥"
          value={sales}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'sales', '零售价');
          }}
          placeholder="请输入零售价"
          maxLength={100000000}
        />
      </Form.Item>

      <Form.Item label="商品条形码">
        <Input
          value={barcode}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'barcode');
          }}
          placeholder="请输入商品条形码"
          maxLength={50}
        />
      </Form.Item>

      <Form.Item label="重量">
        <Input
          suffix="(kg)"
          value={weight}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'weight', '重量');
          }}
          placeholder="请输入商品重量"
          maxLength={100000000}
        />
      </Form.Item>

      <Form.Item label="体积">
        <Input
          suffix="(m³)"
          value={volume}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'volume', '体积');
          }}
          placeholder="请输入商品体积"
          maxLength={100000000}
        />
      </Form.Item>

      <Form.Item label="库存">
        <Input
          value={stock}
          className="w430"
          onInput={(e) => {
            _this.formInput(e, 'stock', '库存');
          }}
          placeholder={stock === -1 || stock === '' ? '不限' : '请输入商品库存'}
        />
        <div className="color999 fz12 mt10">库存正常范围为大于等于0的整数</div>
      </Form.Item>
    </>
  );
}
