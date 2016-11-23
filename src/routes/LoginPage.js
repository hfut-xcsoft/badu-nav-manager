import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Form, Input, Icon, Button } from 'antd'
import styles from './LoginPage.css'

@Form.create({})
class LoginForm extends Component {

  handleSubmit(e) {
    e.preventDefault()
    const { dispatch } = this.props
    this.props.form.validateFields((err, values) => {
      console.log(values)
      dispatch({ type: 'app/doAuth', payload: values })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Username" />)
          }
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />)
          }
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.button}>Log in</Button>
        </Form.Item>
      </Form>
    )
  }
}



const LoginPage = ({ ...props }) => (
  <Card className={styles.card}>
    <LoginForm {...props} />
  </Card>
)

export default connect(state => ({
  app: state.app,
}))(LoginPage)
