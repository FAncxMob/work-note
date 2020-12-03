import { Input as AInput } from 'antd';

const Input = ({ propName, value, changeData }) => {
  function change(val) {
    if (val.target) {
      val = val.target.value;
    }
    changeData(propName, val);
  }

  return <AInput onChange={change} value={value} />;
};

export default Input;
