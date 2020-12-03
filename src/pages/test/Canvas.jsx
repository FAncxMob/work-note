import React, { useState, useRef, useEffect } from 'react';
import singleGoodsPoster from '@/utils/Canvas/singleGoodsPoster';
import grouponHelpSalePoster from '@/utils/Canvas/grouponHelpSalePoster';
import invitationPoster from '@/utils/Canvas/invitationPoster';
import privateHelpSalePoster from '@/utils/Canvas/privateHelpSalePoster';
import { Button } from 'antd';

const posterOptions = {
  singleGoodsPoster: {
    image: `td-image://default/202007/2ddaca87061a4b849acf3a33189c96a6.png`,
    grouponId: '123',
    goodsName:
      '团购名称团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名团购名。',
    goodsDesc:
      '团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述团购描述',
    avatarUrl: 'td-image://HOPIN-merchant/202007/ac8b8af5202a486db9e681a95121d371.png',
    nickName: '昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵',
    priceText: '￥99993.12~￥99993.12',
  },
  grouponHelpSalePoster: {
    date: '8月14日 11:13 ~ 8月15日 08:23',
    image: `td-image://default/202007/2ddaca87061a4b849acf3a33189c96a6.png`,
    priceText: '99993.12~99993.12',
    grouponId: '123',
    grouponTitle: '湖北专供2包13.2元包邮医用成人口罩儿童口罩/消毒湿巾/消毒',
    grouponDesc: '佰昌旗下火品团官方团长专供，请放心下单购买品品质保障，发货及时!价格均为包',
    userId: 1,
    avatarUrl: 'td-image://HOPIN-merchant/202007/ac8b8af5202a486db9e681a95121d371.png',
    nickName: '昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵',
  },
  invitationPoster: {
    userId: 1,
    avatarUrl: 'td-image://HOPIN-merchant/202007/ac8b8af5202a486db9e681a95121d371.png',
    nickName: '昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵',
  },
  privateHelpSalePoster: {
    date: '8月14日 11:13 ~ 8月15日 08:23',
    image: `td-image://default/202007/2ddaca87061a4b849acf3a33189c96a6.png`,
    priceText: '99993.12~99993.12',
    grouponId: '123',
    grouponTitle: '湖北专供2包13.2元包邮医用成人口罩儿童口罩/消毒湿巾/消毒',
    grouponDesc: '佰昌旗下火品团官方团长专供，请放心下单购买品品质保障，发货及时!价格均为包',
    userId: 1,
    avatarUrl: 'td-image://HOPIN-merchant/202007/ac8b8af5202a486db9e681a95121d371.png',
    nickName: '昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵昵称昵称昵称昵称昵称昵',
    ratio: 1,
  },
};

const posterMethod = {
  singleGoodsPoster,
  grouponHelpSalePoster,
  invitationPoster,
  privateHelpSalePoster,
};

const TestCanvas = (props) => {
  const [canvasData, setCanvasData] = useState(null);
  const canvasRef = useRef();

  async function drawPoster(dom) {
    const poster = 'privateHelpSalePoster';
    try {
      const canvas = await posterMethod[poster](dom, posterOptions[poster]);
      setCanvasData(canvas);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    drawPoster(document.getElementById('canvas'));
  }, []);

  function saveImage() {
    console.log(canvasData);
    canvasData.saveFileToAlbum();
  }

  return (
    <div>
      <canvas type="2d" id="canvas" ref={canvasRef} style={{ width: '375px', height: '667px' }} />
      <Button
        className="mt20"
        onClick={() => {
          saveImage();
        }}
        type="primary"
      >
        保存海报
      </Button>
    </div>
  );
};

export default TestCanvas;
