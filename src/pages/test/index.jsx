import React, { useEffect, useState, useRef } from 'react';
import { Radio, Button, Modal } from 'antd';
import { connect } from 'umi';
import Uploader from '@/components/Uploader/index';
import ChooseSellCategory from '@/components/ChooseSellCategory';
import ChooseProductCategory from '@/components/ChooseProductCategory';
import Transfer from '@/components/Transfer/index';

/* 传文件字符串或者对象都行 */
const initFileList = [
  'td-image://default/202010/5832988e78b041c6acd0ffc4a55e73d8.jpg',
  'td-image://default/202010/ed4977f57c3643a698da05f2e399e0dc.jpg',
];

const Test = (props) => {
  const [fileList, setFileList] = useState([]);
  const [fileList1, setFileList1] = useState(initFileList);
  const [isVertical, setIsVertical] = useState(false);
  const [list, setList] = useState({});
  const [visible, setVisible] = useState(false);
  const { dispatch } = props;
  const transferRef = useRef();

  useEffect(() => {}, []);

  async function handleChoose() {
    const res = await ChooseSellCategory({
      categoryIds: [
        '457532963948457984',
        '569057646933905408',
        '572011848601681920',
        '570821638136242176',
        '572013283087204352',
        '569055741981691904',
        '569058110756818944',
      ],
    });
    console.log(res, 111111111111);
  }
  async function handleChoose2() {
    const res = await ChooseProductCategory({
      categoryIds: [
        '570384238515793920',
        '570806520958656512',
        '570381484670005248',
        '570384357315260416',
      ],
    });
    console.log(res, 2222222222);
  }

  const onDirectionChange = (e) => {
    setIsVertical(e.target.value);
  };

  const onConfirm = (e) => {
    console.log('seltree', e);
    setList(e);
  };
  const selData = { 440000: { all: true, code: '440000', name: '广东省', list: {} } };
  return (
    <div>
      <Button onClick={handleChoose}>选择销售分类</Button>
      <Button onClick={handleChoose2}>选择商品分类</Button>
      <div className="">
        <div>
          排列方向:
          <Radio.Group onChange={onDirectionChange}>
            <Radio value={false}>横向</Radio>
            <Radio value>竖向</Radio>
          </Radio.Group>
        </div>
      </div>
      <Uploader
        className="dib"
        drag
        onChange={(res, doneList) => {
          setFileList(res); /* res:所有文件列表； doneList：所有上传完成并且成功的文件列表 */
        }}
        fileList={fileList}
        size="5"
        mode="replace" /* 单张替换（此时limit=1， multiple=false，drag=false） */
        space="10px"
        isVertical={isVertical}
        describe={
          <div className="text-info">
            建议尺寸750*750，最少添加1张图，最多添加5张，可拖拽调整图片顺序
            {isVertical ? 'ddd' : 'dssd'}
          </div>
        }
      />
      <Uploader
        className="dib"
        drag
        onChange={(res, doneList) => {
          setFileList1(res); /* res:所有文件列表； doneList：所有上传完成并且成功的文件列表 */
        }}
        fileList={fileList1}
        size="5"
        limit={5}
        space="10px"
        isVertical={isVertical}
      />
      <a onClick={() => setVisible(true)}> 显示省市搜索{JSON.stringify(list)}</a>
      <Transfer
        initialData={list}
        visible={visible}
        onConfirm={onConfirm}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default connect(({ goodsWarehouseCategory }) => ({
  goodsWarehouseCategory,
}))(Test);
