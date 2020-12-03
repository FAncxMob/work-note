import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag, Modal} from 'antd';
import { CheckCircleOutlined, RedoOutlined } from '@ant-design/icons';

const ACTION = {
  getList: 'TagsModel/getList',
};

const TagsDialog = (props) => {
  const {
    dispatch,
    TagsModel: { listData },
    visible,
  } = props;
  
  const [tags, setTags] = useState([]);

  function setTagsList(){
    setTags(item);
  }
  function changeList() {
    dispatch({
      type: ACTION.getList,
    });
  }
  function handleOk() {
    
  }
  function isInTags(item){
    if(tags.find(item)!==undefined) return true
    return null
  }
  const TagsList = ({item})=>{
    return (
      <Tag
          color={isInTags(item) ? 'success' : 'processing'}
          icon={isInTags(item) && <CheckCircleOutlined />}
          className="mb5"
          key={index}
          onClick={() => {
            setTagsList(item)
          }}
        >{item}</Tag>
    )
  }
  const SelectingSort = () => {
    return (
      <div className="sort-select">
        <div className="df align-center">
          <p className="pt16 fx1 text-ellipsis fz14">大家还在用的</p>
          <div onClick={changeList} className="cup">
            <RedoOutlined className="fz18 colorBlue" />
            <span className="fz14 ml5 colorBlue"> 换一批</span>
          </div>
        </div>
        {listData.map((item, index) => (
          <TagsList item={item}/>
        ))}
        {listData.length < 1 ? <span className="fz14 color999">没有更多数据了</span> : null}
      </div>
    );
  };

  const LocalTags = ()=>{
    return(
      <dvi>
        <p className="pt16 fx1 text-ellipsis fz14">使用历史记录</p>
      </dvi>
      tags.map((item,index)=>(
        <TagsList item={item}/>
        ))
    ) 
  }
  return (
    <Modal
      title='更多标签'
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        props.setVisible(false);
      }}
    >
      <SelectingSort />
      <LocalTags/>
    </Modal>
  );
};

export default connect(({ TagsModel }) => ({
  TagsModel,
}))(TagsDialog);
