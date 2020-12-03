import BT from './DesignComponents/BT/index';

export const TagArea = (param) => {
  return (
    <div className="app-card-lv1">
      <h6>组件选择区域</h6>
      <BT.Tag {...param} />
    </div>
  );
};
