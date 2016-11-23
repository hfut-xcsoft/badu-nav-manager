import React, { Component } from 'react'
import { Modal, Form, Input, Upload, Icon, Select } from 'antd'
import { API_BASE } from '../services/api'
import styles from './CategoryModal.css'


@Form.create({})
export default class CategoryModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      picture_url: props.picture_url,
    }
  }

  handleSubmit() {
    const { onValidSubmit } = this.props
    this.props.form.validateFields((err, values) => {
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

  render() {
    const { visible, onCancel, form, initModel, okText, title, confirmLoading, categories } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
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
            label="分类名称"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入分类名称' }],
              initialValue: initModel.name,
            })(
              <Input placeholder="Name" />)
            }
          </Form.Item>
          <Form.Item
            label="Slug"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('slug', {
              rules: [{ required: true, message: '请输入分类 Slug' }],
              initialValue: initModel.slug,
            })(
              <Input placeholder="Slug" />)
            }
          </Form.Item>
          { categories &&
            <Form.Item
              label="所属分类"
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('category', {
                rules: [{ required: true, message: ' 请选择所属分类' }],
                initialValue: initModel.category,
              })(
                <Select placeholder="Select the category">
                  {categories.map(category => (
                    <Select.Option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
            )}
            </Form.Item>
          }
          <Form.Item
            label="描述"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '请输入分类描述' }],
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
