import React from 'react'
import { connect } from 'dva'
import { Table, Button, Icon, Tooltip, Modal } from 'antd'
import WebsiteModal from '../components/WebsiteModal'
import commonStyles from './CommonPage.css'
import styles from './SharePage.css'
import { timeFormat } from '../utils/time'

function renderState(text) {
  switch (+text) {
    case 0:
      return (
        <Tooltip title="待审核">
          <Icon className={styles.red + ' ' + styles.icon} type="question-circle-o" />
        </Tooltip>
      )
    case 1:
      return (
        <Tooltip title="审核拒绝">
          <Icon className={styles.grey + ' ' + styles.icon} type="close-circle-o" />
        </Tooltip>
      )
    case 2:
      return (
        <Tooltip title="待定中">
          <Icon className={styles.blue + ' ' + styles.icon} type="exclamation-circle-o" />
        </Tooltip>
      )
    case 3:
      return (
        <Tooltip title="已收录">
          <Icon className={styles.green + ' ' + styles.icon} type="check-circle-o" />
        </Tooltip>
      )
    default:
      return <Icon type="minus-circle-o" />
  }
}

const SharePage = ({ share, category, dispatch }) => (
  <div>
    <div className={commonStyles.btns}>
      <Button
        type="default" icon="reload"
        className={commonStyles.refresh}
        onClick={() => dispatch({ type: 'category/fetchList' })}
      >
        刷新
      </Button>
    </div>
    <Table
      dataSource={share.list}
      loading={share.isLoading}
      rowKey={record => record._id}
      className={commonStyles.table}
      expandedRowRender={record => <p>{record.description}</p>}
      columns={[{
        title: '序号',
        key: 'index',
        render: (text, record, index) => <span>{index + 1}</span>,
      }, {
        title: '网站名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <Tooltip title={record.url}>
            <a href={record.url} target="_blank" rel="noopener noreferrer">{text}</a>
          </Tooltip>
        ),
      }, {
        title: '推荐分类',
        dataIndex: 'category',
        key: 'category',
      }, {
        title: '推荐人 Email',
        dataIndex: 'email',
        key: 'email',
      }, {
        title: '推荐时间',
        dataIndex: 'time',
        key: 'time',
        sorter: (a, b) => new Date(a.time) - new Date(b.time),
        render: text => <span>{timeFormat(text)}</span>,
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [{
          text: '待审核',
          value: 0,
        }, {
          text: '审核拒绝',
          value: 1,
        }, {
          text: '审核待定',
          value: 2,
        }, {
          text: '已收录',
          value: 3,
        }],
        onFilter: (value, record) => record.status === +value,
        sorter: (a, b) => a.status - b.status,
        render: renderState,
      }, {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a disabled={record.status === 3}
              onClick={() => dispatch({ type: 'share/openModal', payload: record })}
            >收录</a>
            <span className="ant-divider" />
            <a disabled={record.status === 3}
              onClick={() => dispatch({ type: 'share/requestUpdateShare', payload: { _id: record._id, status: 2 } })}
            >待定</a>
            <span className="ant-divider" />
            <a disabled={record.status === 3}
              onClick={() => dispatch({ type: 'share/requestUpdateShare', payload: { _id: record._id, status: 1 } })}
            >拒绝</a>
          </span>
        ),
      }]}
    />

    <WebsiteModal
      title="收录站点"
      okText="收录"
      categories={category.list}
      visible={share.modal.visible}
      initModel={share.modal.model}
      confirmLoading={share.modal.isLoading}
      onValidSubmit={form => dispatch({ type: 'share/requestEmbodyShare', payload: { ...share.modal.model, ...form } })}
      onCancel={() => dispatch({ type: 'share/clearModal' })}
    />
  </div>
)

export default connect(state => ({
  share: state.share,
  category: state.category,
}))(SharePage)
