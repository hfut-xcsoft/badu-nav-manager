import React, { Component } from 'react'
import { Modal, Form, Input, Upload, Icon, Cascader } from 'antd'
import { API_BASE } from '../services/api'
import styles from './CategoryModal.css'

@Form.create({})
export default class WebsiteModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      picture_url: props.picture_url,
    }
  }

  handleSubmit() {
    const { onValidSubmit } = this.props
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err && typeof onValidSubmit === 'function') {
        onValidSubmit({ ...values, picture_url: this.state.picture_url })
      }
    })
  }

  handleUpload(info) {
    if (info.file.status === 'done') {
      this.setState({ picture_url: info.file.response.url })
    }
  }

  handleCancel() {
    const { form, onCancel } = this.props
    form.resetFields()
    onCancel()
  }

  convertSubcategoryToArr(subcategory) {
    if (subcategory) {
      const { categories } = this.props
      const category = categories.find(cat => cat.children.findIndex(item => item._id === subcategory) !== -1)
      return [category._id, subcategory]
    }
    return ''
  }

  render() {
    const { visible, form, initModel, okText, title, confirmLoading, categories } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const options = categories.map(item => ({
      label: item.name,
      value: item._id,
      children: item.children.map(subitem => ({
        label: subitem.name,
        value: subitem._id,
      })),
    }))
    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        confirmLoading={confirmLoading}
        onCancel={() => this.handleCancel()}
        onOk={() => this.handleSubmit()}
      >
        <Form horizontal>
          <Form.Item
            label="站点名称"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入站点名称' }],
              initialValue: initModel.name,
            })(
              <Input placeholder="Name" />)
            }
          </Form.Item>
          <Form.Item
            label="URL"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('url', {
              rules: [{ required: true, message: '请输入站点 URL' }],
              initialValue: initModel.url,
            })(
              <Input placeholder="URL" />)
            }
          </Form.Item>
          { categories &&
            <Form.Item
              label="所属分类"
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('subcategory', {
                rules: [
                  { required: true, type: 'array', len: 2, message: ' 请选择所属分类' },
                ],
                initialValue: this.convertSubcategoryToArr(initModel.subcategory),
              })(
                <Cascader options={options} placeholder="Please select" />)
              }
            </Form.Item>
          }
          <Form.Item
            label="描述"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '请输入站点描述' }],
              initialValue: initModel.description,
            })(
              <Input placeholder="Description" />)
            }
          </Form.Item>
          <Form.Item
            label="权重"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('weights', {
              rules: [
                { required: true, message: '请输入权重' },
                { type: 'string', message: '必须要为数字', pattern: /^\d+$/ },
              ],
              initialValue: initModel.weights && initModel.weights.toString(),
            })(
              <Input placeholder="Weights" />)
            }
          </Form.Item>
          { initModel.recommend_by &&
            <Form.Item
              label="推荐人"
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('recommend_by', {
                initialValue: initModel.recommend_by,
              })(
                <Input placeholder="Recommender" />)
              }
            </Form.Item>
          }
          <Form.Item
            label="图片"
            {...formItemLayout}
          >
            <Upload
              className={styles.uploader}
              name="picture"
              showUploadList={false}
              action={API_BASE + '/uploads'}
              onChange={info => this.handleUpload(info)}
              headers={{ Authorization: 'Bearer ' + sessionStorage.getItem('token') }}
            >
              {
                this.state.picture_url ?
                  <img src={this.state.picture_url} role="presentation" className={styles.avatar} /> :
                  <Icon type="upload" className={styles.trigger} />
              }
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
