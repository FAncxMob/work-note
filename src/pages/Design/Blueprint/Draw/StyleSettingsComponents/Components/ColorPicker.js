import { useMemo, useState } from 'react';
import { SketchPicker } from 'react-color';

const defaultColor = {
  r: '0',
  g: '0',
  b: '0',
  a: '1',
};

const ColorPicker = ({ value, onChange }) => {
  const [displayPicker, setDisplayPicker] = useState(false);

  const color = useMemo(() => {
    if (!value) return defaultColor;
    const val = value.match(/(\d(\.\d+)?)+/g);
    return {
      r: val[0],
      g: val[1],
      b: val[2],
      a: val[3],
    };
  }, [value]);

  const Style = useMemo(() => {
    return {
      color: {
        width: '100%',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        width: '50px',
        cursor: 'pointer',
      },
      popover: {
        position: 'relative',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    };
  }, [color]);

  function handleChange({ rgb }) {
    const { r, g, b, a } = rgb;
    const val = `rgba(${r},${g},${b},${a})`;
    onChange(val);
  }

  function handleClick() {
    setDisplayPicker(!displayPicker);
  }

  function handleClose() {
    setDisplayPicker(false);
  }

  return (
    <div>
      <div style={Style.swatch} onClick={handleClick}>
        <div style={Style.color} />
      </div>
      {displayPicker ? (
        <div style={Style.popover}>
          <div style={Style.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
