import { Slider, Radio } from 'antd';
import ColorPicker from '../Components/ColorPicker';
import { REG } from './config';

export function settingsStylePart(prop, param) {
  switch (prop) {
    case 'borderWidth':
    case 'margin':
    case 'padding':
    case 'width':
    case 'height':
    case 'lineHeight':
    case 'fontSize':
    case 'borderRadius':
    case 'backgroundWidth':
    case 'backgroundHeight':
    case 'backgroundPositionLeft':
    case 'backgroundPositionTop':
    case 'backgroundSizeWidth':
    case 'backgroundSizeHeight':
      return (
        <div className="df align-center">
          <div className="fx1">
            <Slider {...param} />
          </div>
          <span className="w40 shrink-0 text-right">
            {param.value}
            {getStyleUnit(prop)}
          </span>
        </div>
      );
    case 'borderStyle':
    case 'backgroundRepeat':
    case 'backgroundOrigin':
    case 'backgroundClip':
    case 'backgroundAttachment':
    case 'textAlign':
      return <Radio.Group {...param} />;
    case 'borderColor':
    case 'color':
      return <ColorPicker {...param} />;
    default:
      return null;
  }
}

export function getStylePartParam(prop) {
  switch (prop) {
    case 'borderWidth':
    case 'margin':
    case 'padding':
    case 'borderRadius':
    case 'backgroundWidth':
    case 'backgroundHeight':
    case 'backgroundPositionLeft':
    case 'backgroundPositionTop':
    case 'backgroundSizeWidth':
    case 'backgroundSizeHeight':
    case 'width':
    case 'height':
      return {
        min: 0,
        max: 375,
      };
    case 'borderStyle':
      return {
        optionType: 'button',
        options: [
          { label: '实线', value: 'solid' },
          { label: '双线', value: 'double' },
          { label: '虚线', value: 'dashed' },
          { label: '点状', value: 'dotted' },
        ],
        size: 'small',
      };
    case 'textAlign':
      return {
        optionType: 'button',
        options: [
          { label: '继承', value: 'inherit' },
          { label: '左对齐', value: 'left' },
          { label: '居中对齐', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
        size: 'small',
      };
    case 'backgroundRepeat':
      return {
        optionType: 'button',
        options: [
          { label: '无', value: 'no-repeat' },
          { label: '平铺', value: 'repeat' },
          { label: 'x轴', value: 'repeat-x' },
          { label: 'y轴', value: 'repeat-y' },
        ],
        size: 'small',
      };
    case 'backgroundOrigin':
    case 'backgroundClip':
      return {
        optionType: 'button',
        options: [
          { label: '内边距框', value: 'padding-box' },
          { label: '边框盒', value: 'border-box' },
          { label: '内容框', value: 'content-box' },
        ],
        size: 'small',
      };
    case 'backgroundAttachment':
      return {
        optionType: 'button',
        options: [
          { label: '随页面滚动', value: 'scroll' },
          { label: '固定', value: 'fixed' },
        ],
        size: 'small',
      };
    default:
      return {};
  }
}

export function getStyleAnalysisPattern(prop) {
  switch (prop) {
    case 'borderWidth':
    case 'margin':
    case 'padding':
    case 'width':
    case 'height':
    case 'borderRadius':
      return /(\d+)/g;
    case 'borderStyle':
      return /([a-z]+)/g;
    case 'borderColor':
      return REG.rgba;
    default:
      return /.+/;
  }
}

export function getStyleUnit(prop) {
  switch (prop) {
    case 'borderWidth':
    case 'margin':
    case 'padding':
    case 'width':
    case 'height':
    case 'borderRadius':
      return 'px';
    case 'backgroundSizeWidth':
    case 'backgroundSizeHeight':
    case 'backgroundPositionLeft':
    case 'backgroundPositionTop':
      return '%';
    default:
      return '';
  }
}

export function getDirectionImg(prop) {
  switch (prop) {
    case 'borderWidth':
    case 'borderStyle':
    case 'borderColor':
      return 'border';
    case 'margin':
    case 'padding':
      return prop;
    case 'borderRadius':
      return 'radius';
    default:
      return '';
  }
}
