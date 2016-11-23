import React from 'react'
import { Menu, Icon } from 'antd'
import { browserHistory } from 'dva/router'
// import { connect } from 'dva'
// import { Link } from 'dva/router'
import styles from './MenuFramework.css'

const SubMenu = Menu.SubMenu

function MenuFramwork({ ...props }) {
  function goto(key) {
    browserHistory.push(key)
  }
  return (
    <div className={styles.topaside}>
      <div className={styles.header}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>八度导航管理系统</div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <aside className={styles.sider}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['/']}
              defaultOpenKeys={['nav']}
              onClick={({ key }) => goto(key)}
            >
              <Menu.Item key="/"><Icon type="home" />首页</Menu.Item>
              <SubMenu
                key="nav"
                title={
                  <span><Icon type="user" />导航管理</span>
                }
              >
                <Menu.Item key="/categories">分类管理</Menu.Item>
                <Menu.Item key="/websites">网站管理</Menu.Item>
              </SubMenu>
              <SubMenu
                key="feedbacks"
                title={
                  <span><Icon type="message" />反馈管理</span>
                }
              >
                <Menu.Item key="/shares">网站分享</Menu.Item>
                <Menu.Item key="/feedbacks">用户反馈</Menu.Item>
              </SubMenu>
              <SubMenu
                key="statistic"
                title={
                  <span><Icon type="laptop" />数据统计</span>
                }
              >
                <Menu.Item key="/unknown">选项5</Menu.Item>
              </SubMenu>
            </Menu>
          </aside>
          <div className={styles.content}>
            <div>
              <div style={{ clear: 'both' }}>
                {React.cloneElement(props.children, { ...props })}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
        Ant Design 版权所有 © 2015 由蚂蚁金服体验技术部支持
        </div>
      </div>
    </div>
  )
}

MenuFramwork.propTypes = {
  children: React.PropTypes.node,
}

export default MenuFramwork
