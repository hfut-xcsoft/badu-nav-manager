import React from 'react'
import { connect } from 'dva'
import { Table, Button, Modal } from 'antd'
import WebsiteModal from '../components/WebsiteModal'
import styles from './CommonPage.css'

const WebsitePage = ({ category, website, dispatch }) => {
  const subcategories = category.list.reduce((prev, next) =>
                                              prev.concat(next.children), [])
  return (
    <div>
      <div className={styles.btns}>
        <Button
          type="default" icon="reload"
          loading={category.isLoading} className={styles.refresh}
          onClick={() => dispatch({ type: 'website/fetchList' })}
        >
          刷新
        </Button>
        <Button
          type="primary"
          className={styles.add}
          onClick={() => dispatch({ type: 'website/newModal' })}
        >
          添加新站点
        </Button>
      </div>
      <Table
        dataSource={website.list}
        loading={website.isLoading}
        rowKey={record => record._id}
        className={styles.table}
        columns={[{
          title: '站点名称',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => <a onClick={() => dispatch({ type: 'website/editModal', payload: record })}>{record.name}</a>,
        }, {
          title: ' 二级分类',
          dataIndex: 'subcategory',
          key: 'subcategory',
          filters: subcategories.map(item => ({ text: item.name, value: item._id })),
          onFilter: (value, record) => record.subcategory === value,
          render: (text, record) => (
            <span>{subcategories.length !== 0 && subcategories.find(item => record.subcategory === item._id).name || '未分类'}</span>
          ),
        }, {
          title: '站点描述',
          dataIndex: 'description',
          key: 'description',
        }, {
          title: '权重',
          dataIndex: 'weights',
          key: 'weights',
          sorter: (a, b) => a.weights - b.weights,
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a onClick={() => dispatch({ type: 'website/editModal', payload: record })}>编辑</a>
              <span className="ant-divider" />
              <a onClick={() => Modal.confirm({
                title: '删除确认',
                content: `确定要删除 ${record.name} 吗`,
                onOk() {
                  dispatch({ type: 'website/requestDeleteWebsite', payload: record._id })
                },
              })}
              >删除</a>
            </span>
          ),
        }]}
      />
      <WebsiteModal
        title={website.modal.mode === 'new' ? '新建站点' : '编辑站点'}
        okText={website.modal.mode === 'new' ? '新建' : '修改'}
        categories={category.list}
        visible={website.modal.visible}
        initModel={website.modal.model}
        confirmLoading={website.modal.isLoading}
        onValidSubmit={website.modal.mode === 'new'
          ? form => dispatch({ type: 'website/requestCreateWebsite', payload: form })
          : form => dispatch({ type: 'website/requestUpdateWebsite', payload: { ...website.modal.model, ...form } })
        }
        onCancel={() => dispatch({ type: 'website/clearModal' })}
      />
    </div>
  )
}

export default connect(state => ({
  category: state.category,
  website: state.website,
}))(WebsitePage)
