/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { history, connect } from 'umi';
import { Card, TreeSelect, Upload, Modal, notification, message, Button } from 'antd';
import CustomerForm from '@/components/CustomerForm';
import config from '@/utils/config';
import { signHeader } from '@/utils/sign';
import { PlusOutlined, FieldTimeOutlined, CloseCircleOutlined } from '@ant-design/icons';

const uploadAction = config.uploadUrl;

const { SHOW_PARENT } = TreeSelect;

const attrMap = [
  { value: 0, label: '生产商' },
  { value: 1, label: '贸易商' },
  { value: 2, label: '品牌方' },
  { value: 3, label: '原产基地' },
];

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 11 },
};

@connect(({ login }) => ({
  userLogin: login,
}))
class InductedInfo extends React.Component {
  state = {
    applyStatus: '',
    category: [],
    businessLicenseImages: [],
    otherImages: [],
    businessLicenseImagesLoading: false,
    otherImagesLoading: false,
    currentCategory: [],
  };

  formRef = React.createRef();

  componentDidMount() {
    this.checkApply();
  }

  loadCategory = async (options) => {
    const response = await this.props.dispatch({
      type: 'login/queryCategory',
      payload: { pid: options.id },
    });
    if (!response) return;

    const list = response.list.map(({ id, materialDescription, name: title, pid }) => ({
      id,
      value: id,
      materialDescription,
      title,
      pid,
      isLeaf: options.id !== 0,
      checkable: options.id !== 0,
      selectable: options.id !== 0,
      key: id,
    }));

    if (options.id !== 0) {
      const { category } = this.state;
      const index = category.findIndex((item) => item.id === options.id);
      category[index].children = list;
      this.setState({ category: JSON.parse(JSON.stringify(category)) });
      return;
    }
    this.setState({ category: list });
  };

  handleChangeCategory = (data) => {
    let childrenMap = [];
    const currentCategory = [];
    this.state.category.forEach(({ children }) => {
      if (children) childrenMap = [...childrenMap, ...children];
    });
    childrenMap.forEach(({ title, materialDescription, id, pid }) => {
      data.forEach((i) => {
        if (id === i) {
          currentCategory.push({ title, materialDescription, id, pid });
        }
      });
    });
    this.setState({ currentCategory });
  };

  handleUpChange = (data, attrName) => {
    this.setState({
      [attrName]: data.fileList,
      [`${attrName}Loading`]: true,
    });
  };

  // 上传前拦截
  beforeUpload = (file) => {
    if (!/^image\//.test(file.type)) {
      message.warning('只能上传图片类文件');
      return Promise.reject('停止上传文件');
    }
    if (file.size > 5 * 1024 * 1024) {
      message.warning('文件最大不能超过5M');
      return Promise.reject('停止上传文件');
    }
    return Promise.resolve(file);
  };

  asyncModal = () => {
    const { confirm } = Modal;
    return new Promise((res) => {
      confirm({
        title: '确认要移除图片吗',
        centered: true,
        onCancel: () => {
          res(false);
        },
        onOk: () => {
          res(true);
        },
      });
    });
  };

  handleSubmit = (value) => {
    const { currentCategory } = this.state;
    if (currentCategory.length > 5) return message.warning('主经营类目最多选择5项');
    value.businessLicenseImages = value.businessLicenseImages.fileList
      .map(({ subUrl }) => subUrl)
      .join(',');
    value.otherImages =
      value.otherImages && value.otherImages.fileList.map(({ subUrl }) => subUrl).join(',');
    value.materialArray = currentCategory.map(
      ({ id: supplierCategoryId, pid: supplierCategoryPid }) => ({
        supplierCategoryId,
        supplierCategoryPid,
      }),
    );
    return this.props.dispatch({
      type: 'login/supplierApply',
      payload: value,
      callback: async () => {
        await window.User.setInfoApplyStatus();
        this.setState({ applyStatus: 'applying' });
      },
    });
  };

  labelContent = (name) => (
    <>
      <i className="text-red pr5">*</i>
      {name}
    </>
  );

  async handleRemove(file, attrName) {
    const res = await this.asyncModal();
    if (res) {
      const arr = this.state[attrName];
      arr.splice(file.uid, 1);
      return this.setState({ [attrName]: arr });
    }
    return Promise.reject('已取消');
  }

  handleSuccess(res, attrName) {
    const { sub_code: subCode, data, sub_msg: subMsg } = res;
    if (subCode !== 'ok') return notification.error({ message: subMsg });
    const arr = this.state[attrName];
    const { filePath, fileUrl } = data;
    const currentImgObject = {
      uid: arr.length - 1,
      url: fileUrl,
      subUrl: filePath,
    };
    arr.splice(arr.length - 1, 1, currentImgObject);
    return this.setState({ [attrName]: arr, [`${attrName}Loading`]: false });
  }

  async checkApply() {
    await window.User.setInfoApplyStatus(); // -1 未申请 0 待审核 1 审核通过 2 审核不通过
    const status = window.User.getInfoApplyStatus(); // -1 未申请 0 待审核 1 审核通过 2 审核不通过
    switch (status) {
      case 0:
        this.setState({ applyStatus: 'applying' });
        break;
      case 1:
        history.replace('/shop/index');
        break;
      case 2:
        this.setState({ applyStatus: 'reject' });
        break;
      default:
        this.loadCategory({ id: 0 });
    }
  }

  renderContent = () => {
    switch (this.state.applyStatus) {
      case 'applying':
        return (
          <div className="df flex-column align-center pt50 pb50">
            <FieldTimeOutlined className="fz100 colorBlue mb10" />
            <span className="fz30 color666">资料审核中……</span>
            <Button
              type="primary"
              className="mt10"
              onClick={() => this.props.dispatch({ type: 'login/logout' })}
            >
              返回登录
            </Button>
          </div>
        );
      case 'reject':
        return (
          <div className="df flex-column align-center pt50 pb50">
            <CloseCircleOutlined className="fz100 text-red mb10" />
            <span className="fz30 color666">审核失败</span>
            <div className="df mt10">
              <Button
                type="primary"
                onClick={() =>
                  this.setState({ applyStatus: '' }, () => this.loadCategory({ id: 0 }))
                }
              >
                重新申请
              </Button>
              <Button
                className="ml10"
                onClick={() => this.props.dispatch({ type: 'login/logout' })}
              >
                返回登录
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    const {
      businessLicenseImages,
      otherImages,
      businessLicenseImagesLoading,
      otherImagesLoading,
      currentCategory = [],
      applyStatus,
    } = this.state;

    const editFormList = [
      {
        type: 'input',
        name: 'supplierName',
        label: this.labelContent('供货商名称'),
        elOptions: {
          placeholder: '请输入供货商名称',
        },
        extra: (
          <span className="por top-5 color999">
            需与当地政府颁发的商业许可证书或企业注册证上的企业名称完全一致，信息审核审核成功后，供货商名称不可修改。
          </span>
        ),
        formItemOption: {
          className: 'mb10',
        },
        rule: [
          { required: true, message: '供货商名称不能为空!' },
          { max: 50, message: '供货商名称限50个字以内！' },
        ],
      },
      {
        type: 'input',
        name: 'businessLicenseNo',
        label: this.labelContent('统一社会信用代码'),
        elOptions: {
          placeholder: '请输入统一社会信用代码',
        },
        extra: (
          <span className="por top-5 color999">
            请输入15位营业执照注册号或18位的统一社会信用代码
          </span>
        ),
        formItemOption: {
          className: 'mb10',
        },
        rule: [{ required: true, message: '统一社会信用代码不能为空!' }],
      },
      {
        type: 'input',
        name: 'contactName',
        label: this.labelContent('联系人姓名'),
        elOptions: {
          placeholder: '请输入联系人姓名',
        },

        formItemOption: {
          className: 'mb10',
        },
        rule: [
          { required: true, message: '联系人姓名不能为空!' },
          { max: 8, message: '姓名限8个字以内！' },
        ],
      },
      {
        type: 'radio',
        name: 'properties',
        label: this.labelContent('供货商属性'),
        formItemOption: {
          className: 'mb0',
        },
        rule: [{ required: true, message: '请选择供货商属性!' }],
        elOptions: {
          options: attrMap,
          optionType: 'button',
          buttonStyle: 'solid',
          size: 'middle',
        },
      },
      {
        type: 'treeSelect',
        name: 'materialArray',
        label: this.labelContent('主经营类目'),
        formItemOption: {
          className: 'mb0',
        },
        rule: [{ required: true, message: '请选择主经营类目!' }],
        elOptions: {
          treeDataSimpleMode: true,
          placeholder: '请选择主经营类目',
          treeData: this.state.category,
          treeCheckable: true,
          showCheckedStrategy: SHOW_PARENT,
          loadData: this.loadCategory,
          onChange: (res) => this.handleChangeCategory(res),
        },
      },
      {
        name: 'businessLicenseImages',
        label: this.labelContent('营业执照'),
        formItemOption: {
          className: 'mb0',
        },
        rule: [{ required: true, message: '请上传营业执照!' }],
        el: (
          <Upload
            action={`${uploadAction}file/file/upload`}
            listType="picture-card"
            data={{ appId: 'S' }}
            headers={signHeader()}
            fileList={businessLicenseImages}
            onChange={(e) => this.handleUpChange(e, 'businessLicenseImages')}
            beforeUpload={(e) => this.beforeUpload(e, 'img')}
            onRemove={(e) => this.handleRemove(e, 'businessLicenseImages')}
            onSuccess={(e) => {
              this.handleSuccess(e, 'businessLicenseImages');
            }}
          >
            {businessLicenseImages.length > 0 || businessLicenseImagesLoading ? null : (
              <PlusOutlined className="fz30" />
            )}
          </Upload>
        ),
      },
      {
        name: 'otherImages',
        label: '其他资质证书',
        formItemOption: {
          className: 'mb0',
        },
        el: (
          <Upload
            action={`${uploadAction}file/file/upload`}
            listType="picture-card"
            data={{ appId: 'S' }}
            headers={signHeader()}
            fileList={otherImages}
            onChange={(e) => this.handleUpChange(e, 'otherImages')}
            beforeUpload={(e) => this.beforeUpload(e, 'img')}
            onRemove={(e) => this.handleRemove(e, 'otherImages')}
            onSuccess={(e) => {
              this.handleSuccess(e, 'otherImages');
            }}
          >
            {otherImages.length >= 20 || false || otherImagesLoading ? null : (
              <PlusOutlined className="fz30" />
            )}
          </Upload>
        ),
      },
      {
        name: 'notes',
        aroundForm: true,
        el: currentCategory.length ? (
          <div className="bgc-upload p10 mb30" key="only">
            {currentCategory.map(({ materialDescription, title }, index) => (
              <div key={`${title}-${index}`}>
                <p className="color666 mb0">经营类目为『{title}』需上传以下资质证书:</p>
                <p className="color999">{materialDescription}</p>
              </div>
            ))}
          </div>
        ) : (
          <div key="only" />
        ),
      },
    ];

    return (
      <div className="w100p df justify-center">
        <Card
          title={
            <p className="text-center mb0 fz20">
              {applyStatus === '' ? '供货商信息登记' : '供货商信息审核结果'}
            </p>
          }
          className="w600 bdr5"
        >
          {applyStatus === '' ? (
            <CustomerForm
              formItemLayout={layout}
              layout={layout}
              FormList={editFormList}
              hideCancelButton
              formRef={this.formRef}
              tailFormItemLayout={tailFormItemLayout}
              okText="提交"
              onSubmit={this.handleSubmit}
            />
          ) : (
            this.renderContent()
          )}
        </Card>
      </div>
    );
  }
}
export default InductedInfo;
