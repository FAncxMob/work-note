import React, { Component } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Form,
  Button,
  Input,
  TreeSelect,
  Tag,
  Upload,
  Radio,
  Table,
  message,
  Popconfirm,
  Select,
  Modal,
} from 'antd';
import DragUpload from '@/components/DragUpload/index';
import {
  FileImageOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';

import DynamicTags from '@/components/DynamicTags/index';

import UFF from '@/utils/UFF';
import { signHeader } from '@/utils/sign';
import SortDialog from '../../components/SortDialog';

import {
  toSetDetailModel,
  filterCurrentCommission,
  getSkusTableByRecursion,
  handleSettingsChangeInput,
  deleteTag,
} from './utils/utils';

import { submitInfo, checkNumberInput } from './utils/submit';
import { initData, settingsMap } from './utils/init';
import { deliverWayMap } from '../utils';
import {
  setTableAllData,
  upDataStates,
  addGuideType,
  minusMultiGuideType,
  minusMultiGuide,
  addMultiGuide,
  simpleGuide,
} from './utils/guide';
import FileHandle from './utils/file';
import { multiGuideColumnsTable } from './utils/guideTable';
import config from '../../../../../app/config';

import './index';

const uploadAction = config.uploadUrl;

const { TextArea } = Input;
const { Option } = Select;

const uploadButton = (str = '上传图片', type = 'img') => (
  <div>
    {type === 'img' ? (
      <FileImageOutlined className="fz30" />
    ) : (
      <PlaySquareOutlined className="fz30" />
    )}
    <div style={{ marginTop: 8 }}>{str}</div>
  </div>
);

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 22,
  },
};
@connect(({ productModel, loading }) => ({ productModel, loading }))
class ProductDetail extends Component {
  formRef = React.createRef();

  settingTableType = 0; // 批量设置的table项

  settingTableTypeValue = ''; // 批量设置的table项的值

  state = {
    previewType: 'image',
    currentCommission: 0, // 当前分类的拥挤比例比分比整数
    previewResource: '', // 大图资源
    guideType: false, // 默认不开启多规格
    details: initData(),
    columns: [],
    hasSkuAttrs: false,
    skusType: [], // 本地多规格数据源 item:{title:'',skus:[{skuName:''}]}
    skusTableList: [], // 多规格总汇数据item:{表格所需的字段}
    id: '', // 商品ID
    submitLoading: false,
  };

  async componentWillMount() {
    const timer = setTimeout(() => {
      console.log('212');
    }, 1000);
    await timer;
    console.log(987);
    FileHandle.setThis(this);
    await this.handleCategoryOnLoadData();
    await this.handleCityOnLoadData();
    const { query } = history.location;
    if (query.id !== undefined) {
      await this.setState({
        id: query.id,
      });
      this.getProductDetails();
    }
  }

  // 获取商品分类
  async handleCategoryOnLoadData() {
    const { dispatch } = this.props;
    const { categorySearchData, categoryTree } = this.props.productModel;
    if (categoryTree.length < 1) {
      await dispatch({
        type: 'productModel/categoryOnLoadData',
        payload: { ...categorySearchData },
      });
    }
  }

  // 获取服务城市
  async handleCityOnLoadData() {
    const { dispatch } = this.props;
    const { cityTree } = this.props.productModel;
    if (cityTree.length < 1) {
      await dispatch({
        type: 'productModel/cityOnLoadData',
        payload: { province: '' },
      });
    }
  }

  // 获取商品详情
  getProductDetails() {
    const that = this;
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'productModel/getDetail',
      payload: { id },
      callback: (res) => {
        toSetDetailModel(res, that);
      },
    });
  }

  // { fileList item数据形式
  //   uid: '-xxx',
  //   percent: 50,
  //   name: 'image.png',
  //   status: 'uploading',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // }
  // 查看大图
  async handlePreview(e, type) {
    const data = {
      previewResource: type === 'video' ? UFF.getVideoUrl(e.subUrl) : UFF.getProductImage(e.subUrl),
      previewVisible: true,
    };
    data.previewType = type || 'image';
    await this.setState({ ...data });
  }

  // 表单输入
  formInput(e, name, str) {
    const { value } = e.target;
    const { details } = this.state;
    details[name] = value;
    this.setState({
      details,
    });
    checkNumberInput(name, value, str);
  }

  // 详情select选择
  selectInput(e, name) {
    // const { value } = e.target;
    const { details } = this.state;
    details[name] = e;
    if (name === 'categoryId') {
      const { categoryTree } = this.props.productModel;
      filterCurrentCommission(e, categoryTree, this);
    }
    this.setState({
      details,
    });
  }

  // 切换规格
  changeGuide() {
    this.setState({
      guideType: !this.state.guideType,
    });
  }

  // 规格输入
  handleInputSkus(e, index, index2) {
    const { skusType, skusTableList } = this.state;
    const { value } = e.target;

    // 输入具体规格
    if (index2 !== undefined) {
      if (skusType[index].skus.some((item) => item.skuName === value)) {
        message.warn('具体规格不能相同');
        return;
      }
      skusType[index].skus[index2].skuName = value;
      getSkusTableByRecursion(skusTableList, skusType[0], skusType[1]);
      this.setState({
        skusType,
        skusTableList,
      });
    } else {
      if (skusType.some((item) => item.title === value)) {
        message.warn('规格标题不能相同');
        return;
      }
      // 输入规格标题
      skusType[index].title = value;
      upDataStates(skusType, skusTableList, this);
    }
  }

  // 多规格分类标题栏
  multiGuideTypeTitle() {
    const { skusType } = this.state;
    // title, skus;
    return (
      <>
        {skusType.map((item, index) => {
          return (
            <div key={`${index}`}>
              {this.multiGuideFormItem({
                label: '规格标题',
                ele: [
                  <Input
                    key={`${index}`}
                    className="w430"
                    placeholder="请输入规格标题"
                    addonAfter={
                      skusType.length > 1 ? (
                        <Button
                          size="small"
                          onClick={() => {
                            minusMultiGuideType(index, this);
                          }}
                          shape="circle"
                          icon={<MinusOutlined className="fz16 " />}
                        />
                      ) : null
                    }
                    maxLength={10}
                    defaultValue={item.title}
                    onChange={(e) => {
                      this.handleInputSkus(e, index);
                    }}
                    suffix="(必填)"
                  />,
                ],
              })}
              {this.multiGuideFormItem({
                label: '具体规格',
                type: 2,
                index,
                ele: item.skus.map((item2, index2) => (
                  <Input
                    style={{ width: 180 }}
                    key={`${index}${index2}`}
                    placeholder="输入规格"
                    className="mr10"
                    defaultValue={item2.skuName}
                    onChange={(e) => {
                      this.handleInputSkus(e, index, index2);
                    }}
                    maxLength={20}
                    addonAfter={
                      item.skus.length > 1 ? (
                        <Button
                          size="small"
                          onClick={() => {
                            minusMultiGuide(index, index2, item2, item.skus.length, this);
                          }}
                          shape="circle"
                          icon={<MinusOutlined className="fz16" />}
                        />
                      ) : null
                    }
                  />
                )),
              })}
            </div>
          );
        })}
      </>
    );
  }

  // 表单项
  multiGuideFormItem({ label = '', rules = null, ele, type = 1, index }) {
    return (
      <Form.Item label={label} rules={[{ ...rules }]}>
        <div className="df align-center">{ele}</div>
        {type !== 1 ? (
          <Button
            className="mt10"
            onClick={() => {
              addMultiGuide(index, this);
            }}
            icon={<PlusOutlined className="fz16" />}
          >
            添加规格
          </Button>
        ) : null}
      </Form.Item>
    );
  }

  // 规格表格输入
  handleInputSkusTable(e, name, index, tag) {
    const { value } = e.target;
    const { skusTableList } = this.state;
    skusTableList[index][name] = value;
    // this.validator(value, str);
    this.setState({
      skusTableList,
    });
    checkNumberInput(name, value, tag);
  }

  // 处理规格分类，并合并数据
  skusTableConcatData(arr) {
    const multiGuideColumns = multiGuideColumnsTable.bind(this);
    const newColumns = multiGuideColumns();
    arr.forEach((item, index) => {
      // 向表格项中添加新的规格栏目
      newColumns.splice(index + 1, 0, {
        title: item.title,
        align: 'center',
        key: `101${index + 1}`,
        width: '10%',
        render: (text, record) => <span>{record.name[index]}</span>,
      });
    });
    return newColumns;
  }

  // 批量设置数据的选项值
  handleSettingsChange(val) {
    this.settingTableType = val;
    this.refs.allSettings.setState({
      value: '',
    });
  }

  // 多规格表格
  multiGuideTable() {
    const { skusTableList, columns } = this.state;
    return (
      <>
        <div className="mt20">
          <Select
            defaultValue={0}
            style={{ width: 200 }}
            onChange={(e) => {
              this.handleSettingsChange(e);
            }}
          >
            {settingsMap.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Input
            className="mr10 ml10"
            ref="allSettings"
            style={{ width: 200 }}
            onChange={(e) => {
              handleSettingsChangeInput(e, this);
            }}
            placeholder="请输入设置内容"
          />
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              setTableAllData(this);
            }}
          >
            确认
          </Button>
        </div>
        <Table bordered className="mt10" dataSource={[...skusTableList]} columns={columns} />
      </>
    );
  }

  // 多规格分类
  multiGuideType() {
    const { skusType } = this.state;
    return (
      <>
        {this.multiGuideTypeTitle()}
        {skusType.length >= 2 ? null : (
          <Button
            type="primary"
            onClick={() => {
              addGuideType(this);
            }}
            icon={<PlusOutlined className="fz16" />}
          >
            添加规格分类
          </Button>
        )}
      </>
    );
  }

  // 多规格
  multiGuide() {
    const { skusTableList, hasSkuAttrs } = this.state;
    return (
      <Card
        type="inner"
        className="mb24"
        title={`多规格设置(共${skusTableList.length}个规格)`}
        extra={
          hasSkuAttrs ? null : (
            <Button
              onClick={() => {
                this.changeGuide();
              }}
            >
              退出多规格
            </Button>
          )
        }
      >
        {this.multiGuideType()}
        {this.multiGuideTable()}
      </Card>
    );
  }

  addSortType() {}

  render() {
    const { categoryTree, cityTree } = this.props.productModel;
    const { guideType, previewVisible, previewResource, previewType, submitLoading } = this.state;
    const {
      id = undefined,
      name, // 商品名
      desc,
      categoryId, // 商品分类id
      deliveryType, // 发货方式
      images, // 商品图
      serviceCities,
      shelveStatus,
      tags,
      detailImages, // 详情图
      video, // 商品视频
    } = this.state.details;
    return (
      <>
        <PageHeaderWrapper title="">
          <Card>
            <Form {...layout} ref={this.formRef} className="guide">
              <Form.Item label="商品名称" className="detail-rule">
                <Input
                  placeholder="请输入商品名称"
                  className="w430"
                  value={name}
                  onInput={(e) => {
                    this.formInput(e, 'name');
                  }}
                  maxLength={50}
                />
              </Form.Item>

              <Form.Item label="商品分类" className="detail-rule">
                {/* <TreeSelect
                  allowClear
                  className="w430"
                  placeholder="请选择商品分类"
                  value={categoryId || ''}
                  onChange={(e) => {
                    this.selectInput(e, 'categoryId');
                  }}
                  treeData={categoryTree}
                /> */}
                <>
                  <Select
                    // mode="multiple"
                    showSearch
                    allowClear
                    placeholder="请选择分类"
                    className="w430"
                    value={categoryId || ''}
                    onChange={(e) => {
                      this.selectInput(e, 'categoryId');
                    }}
                  >
                    {categoryTree.map((item) => (
                      <Option value={item.text} key={item.value}>
                        {item.text}
                      </Option>
                    ))}
                  </Select>
                  {/* <Button
                    type="primary"
                    onClick={() => {
                      this.addSortType();
                    }}
                    icon={<PlusOutlined className="fz16" />}
                  >
                    添加分类
                  </Button> */}
                </>
              </Form.Item>
              <Form.Item label="商品标签" className="detail-rule">
                <div className="w430 por">
                  <DynamicTags
                    tags={[...tags]}
                    tagsHandleChange={(val) => {
                      this.setState((state) => {
                        state.details.tags = val;
                        return state;
                      });
                    }}
                  />
                </div>
              </Form.Item>

              {/* <Form.Item label="服务城市" className="detail-rule">
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  placeholder="请选择服务城市"
                  className="w430"
                  value={serviceCities}
                  onChange={(e) => {
                    this.selectInput(e, 'serviceCities');
                  }}
                >
                  {cityTree.map((item) => (
                    <Option value={item.text} key={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}

              <Form.Item label="商品描述">
                <TextArea
                  maxLength={500}
                  className="w430"
                  value={desc}
                  onInput={(e) => {
                    this.formInput(e, 'desc');
                  }}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  placeholder="请输入商品描述(最多500字)"
                />
              </Form.Item>

              {/* <Form.Item label="发货方式" className="detail-rule">
                <Radio.Group
                  options={deliverWayMap}
                  disabled={shelveStatus === 2} // 上架的商品不能更改发货方式
                  value={deliveryType}
                  onChange={(e) => {
                    this.formInput(e, 'deliveryType');
                  }}
                />
              </Form.Item> */}

              {/* 规格显示 */}

              {guideType ? this.multiGuide() : simpleGuide(this)}

              <Form.Item label="商品图" className="detail-rule">
                <DragUpload
                  action={uploadAction}
                  listType="picture-card"
                  fileList={images && images.length > 0 ? images : null}
                  data={{ appId: 'S' }}
                  headers={signHeader()}
                  onRemove={(e) => FileHandle.handleRemove(e, 'details', 'images')}
                  onPreview={(e) => {
                    this.handlePreview(e);
                  }}
                  onChange={(e) => FileHandle.handleUpChange(e, 'details', 'images')}
                  beforeUpload={{ type: 'image' }}
                  onSuccess={(e) => {
                    FileHandle.handleSuccess(e, 'details', 'images');
                  }}
                >
                  {images.length >= 5 ? null : uploadButton('上传图片')}
                </DragUpload>
                <p className="color999 fz12">
                  建议尺寸750*750，最少添加1张图，最多添加5张，可拖拽调整图片顺序
                </p>
              </Form.Item>

              <Form.Item label="商品视频">
                <Upload
                  action={uploadAction}
                  listType="picture-card"
                  fileList={video}
                  data={{ appId: 'S' }}
                  headers={signHeader()}
                  onRemove={(e) => FileHandle.handleRemove(e, 'details', 'video')}
                  onPreview={(e) => {
                    this.handlePreview(e, 'video');
                  }}
                  onChange={(e) => FileHandle.handleUpChange(e, 'details', 'video')}
                  beforeUpload={(e) => FileHandle.beforeUpload(e, { type: 'video' })}
                  onSuccess={(e) => {
                    FileHandle.handleSuccess(e, 'details', 'video');
                  }}
                >
                  {video.length >= 1 ? null : uploadButton('上传视频', 'video')}
                </Upload>
                <p className="color999 fz12">
                  仅支持一个视频；仅可显示60S时长的视频，超过60s无法上传
                </p>
              </Form.Item>

              <Form.Item label="商品详情图">
                <DragUpload
                  action={uploadAction}
                  listType="picture-card"
                  fileList={detailImages}
                  data={{ appId: 'S' }}
                  headers={signHeader()}
                  onRemove={(e) => FileHandle.handleRemove(e, 'details', 'detailImages')}
                  onPreview={(e) => {
                    this.handlePreview(e);
                  }}
                  onChange={(e) => FileHandle.handleUpChange(e, 'details', 'detailImages')}
                  beforeUpload={(e) => FileHandle.beforeUpload(e, { type: 'image' })}
                  onSuccess={(e) => {
                    FileHandle.handleSuccess(e, 'details', 'detailImages');
                  }}
                >
                  {detailImages.length >= 20 ? null : uploadButton('上传详情图')}
                </DragUpload>
                <p className="color999 fz12">最多添加20张，可拖拽调整图片顺序</p>
              </Form.Item>

              <p className="color999 fz12">*平台佣金默认等于供货价 * 平台佣金比例。</p>

              <Form.Item style={{ textAlign: 'center' }}>
                {id ? (
                  <Popconfirm
                    title="更改商品，会导致商品需要重新审核，请确认"
                    onConfirm={() => {
                      submitInfo(this);
                    }}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button type="primary" className="mr20" loading={submitLoading}>
                      保存
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    type="primary"
                    className="mr20"
                    loading={submitLoading}
                    onClick={() => {
                      submitInfo(this);
                    }}
                  >
                    保存
                  </Button>
                )}

                <Button
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* <UploadImage /> */}
        </PageHeaderWrapper>
        <Modal
          visible={previewVisible}
          title="查看大图"
          footer={null}
          onCancel={() => {
            this.setState({ previewVisible: false });
          }}
        >
          {previewType === 'image' ? (
            <img style={{ width: '100%' }} src={previewResource} />
          ) : (
            <video controls style={{ width: '100%' }}>
              <source src={previewResource} />
              <track kind="captions" />
              <p>您的浏览器不支持HTML5视频播放功能</p>
            </video>
          )}
        </Modal>
        <SortDialog />
      </>
    );
  }
}

export default ProductDetail;
