import { settingsType } from '../../data/types';

export default {
  style: {
    parts: [
      {
        name: 'title',
        cname: '标题',
        borderWidth: '1px 10px 20px 30px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,1)',
        borderRadius: '50px',
        margin: '10px 20px 30px 40px',
        padding: '1px 2px 3px 4px',
        background:
          'rgba(0,255,0,1) url(https://image.tradedge.cn/default/202011/1214bc704891401491400ce7be78b4b5.jpg?x-oss-process=style/p_gb_p) repeat scroll 0% 0% / auto padding-box border-box',
        width: '20px',
        height: '20px',
        textAlign: 'left',
        fontSize: '14px',
        color: 'rgba(0,0,0,1)',
        lineHeight: '14px',
      },
      // {
      //   name: 'subTitle',
      //   cname: '副标题',
      //   borderWidth: '1px',
      //   borderStyle: 'solid',
      // },
    ],
  },
  data: {
    title: '主标题',
    subTitle: '主标题',
  },
  settings: [
    {
      name: 'title',
      cname: '标题',
      type: settingsType.input,
    },
    {
      name: 'subTitle',
      cname: '副标题',
      type: settingsType.input,
    },
  ],
  method: {
    click: {
      link: null,
      linkType: null,
    },
  },
};
