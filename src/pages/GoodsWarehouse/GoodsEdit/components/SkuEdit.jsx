import React, { useEffect, useState } from 'react';
import { Card, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import SkuLabelModal from './skuLabelModal';
import SkuItemEdit from './SkuItemEdit';
import SkuTable from './skuTable';

const LABEL_TEXT = ['一', '二'];

const GoodsEdit = (props) => {
  const [skuInfo, setSkuInfo] = useState({});
  const [labelForm, setLabelForm] = useState({ visible: false, skuLabel: '' });

  const { form, onChange = () => {}, value = {} } = props;
  const { skuAttrs = [], skus: dataSource = [], skuLabelItem = [] } = value;

  function changeSkuInfo(data, changeSkuList) {
    const obj = { ...skuInfo, ...data };
    let skuList = obj.skus;
    if (changeSkuList) {
      skuList = makeUpSkuList(obj.skuLabelItem);
    }

    skuList = formatSkus(skuList);
    onChange({ ...obj, skus: skuList });
  }

  useEffect(() => {
    setSkuInfo({
      skuAttrs,
      skus: dataSource,
      skuLabelItem,
    });
  }, [value]);

  function formatSkus(list) {
    return list.map((item) => {
      const {
        limit = '',
        sales = '',
        marketPrice = '',
        image = '',
        id = '',
        mainSpec,
        secondSpec,
        stock = -1,
      } = item;

      const name = [mainSpec, secondSpec].filter((i) => !!i);

      return {
        stock,
        limit,
        sales,
        marketPrice,
        image,
        id,
        name,
        mainSpec,
        secondSpec,
      };
    });
  }

  // 新增商品规格项目
  function handleAddSkuLabel({ skuLabel }) {
    const { changeIndex } = labelForm;

    if (skuAttrs.includes(skuLabel)) {
      setLabelForm({ visible: false, skuLabel: '' });
      return;
    }

    let changeList = [];
    if (changeIndex) {
      skuAttrs[changeIndex] = skuLabel;
      changeList = [...skuAttrs];
    } else {
      changeList = [...skuAttrs, skuLabel];
    }

    changeSkuInfo({ skuAttrs: changeList });
    setLabelForm({ visible: false, skuLabel: '' });
  }

  // 删除商品规格项目
  function handleDeleteSkuLabel(index) {
    skuAttrs.splice(index, 1);
    skuLabelItem.splice(index, 1);
    changeSkuInfo(
      {
        skuAttrs,
        skuLabelItem,
      },
      true,
    );
  }

  function renderAddSkuLabelBtn() {
    if (skuAttrs.length >= 2) return null;

    return (
      <Button
        className="mb10"
        onClick={() => {
          setLabelForm({ visible: true, skuLabel: '' });
        }}
      >
        +添加规格项目
      </Button>
    );
  }

  // sku改变
  const handleSkuItemChange = (list, index) => {
    skuLabelItem[index] = list;

    changeSkuInfo(
      {
        skuLabelItem,
      },
      true,
    );
  };

  function makeUpSkuList(skuLabelItemList) {
    const [mainList = [], secList = []] = skuLabelItemList;
    const list = [];
    if (secList && secList.length) {
      for (const mainSpec of mainList) {
        for (const secondSpec of secList) {
          const item = {
            mainSpec: mainSpec.name,
            image: mainSpec.image,
            secondSpec: secondSpec.name,
          };
          list.push(item);
        }
      }
    } else {
      for (const mainSpec of mainList) {
        const item = {
          mainSpec: mainSpec.name,
        };
        list.push(item);
      }
    }
    return list;
  }

  return (
    <Card>
      <div>
        {skuAttrs.map((item, index) => (
          <Card key={index} className="mb10">
            <div className="mb10 shrink-0">
              <div className="dib w70">{LABEL_TEXT[index]}级规格：</div>
              <div className="ml10 dib">
                <Tag
                  closable
                  color="blue"
                  visible
                  onClick={() => {
                    setLabelForm({ visible: true, skuLabel: item, changeIndex: String(index) });
                  }}
                  onClose={() => {
                    handleDeleteSkuLabel(index);
                  }}
                >
                  {item}
                </Tag>
              </div>
            </div>
            <div className="ml70 pt10 pr10 dib">
              <SkuItemEdit
                value={skuLabelItem[index]}
                withImage={index === 0}
                onChange={(list) => {
                  handleSkuItemChange(list, index);
                }}
              />
            </div>
          </Card>
        ))}
      </div>
      {renderAddSkuLabelBtn()}
      {dataSource.length ? (
        <Card>
          <SkuTable skuAttrs={skuAttrs} form={form} dataSource={dataSource} />
        </Card>
      ) : null}

      <SkuLabelModal
        visible={labelForm.visible}
        skuLabel={labelForm.skuLabel}
        onCancel={() => {
          setLabelForm({ visible: false, skuLabel: '' });
        }}
        onOk={(res) => {
          handleAddSkuLabel(res);
        }}
      />
    </Card>
  );
};

export default GoodsEdit;
