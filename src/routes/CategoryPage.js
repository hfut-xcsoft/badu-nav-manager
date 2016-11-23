import React from 'react'
import { connect } from 'dva'
import { Table, Button, Modal } from 'antd'
import styles from './CommonPage.css'
import CategoryModal from '../components/CategoryModal'


const CategoryPage = ({ category, dispatch }) => (
  <div>
    <div className={styles.btns}>
      <Button
        type="default" icon="reload"
        loading={category.isLoading} className={styles.refresh}
        onClick={() => dispatch({ type: 'category/fetchList' })}
      >
        刷新
      </Button>
      <Button
        type="primary"
        className={styles.add}
        onClick={() => dispatch({ type: 'category/newCategoryModal', payload: true })}
      >
        添加一级分类
      </Button>
    </div>
    <Table
      dataSource={category.list}
      loading={category.isLoading}
      rowKey={record => record._id}
      pagination={false}
      className={styles.table}
      columns={[{
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <a href={`/categories/${record._id}`}>{text}</a>,
      }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      }, {
        title: 'Slug',
        dataIndex: 'slug',
        key: 'slug',
      }, {
        title: '权重',
        dataIndex: 'weights',
        key: 'weights',
        sorter: (a, b) => a.weights - b.weights,
      }, {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          if (typeof record.children !== 'undefined') {
            return (
              <span>
                <a onClick={() => dispatch({ type: 'category/editCategoryModal', payload: record })}>编辑</a>
                <span className="ant-divider" />
                <a onClick={() => dispatch({ type: 'category/newSubcategoryModal', payload: record._id })}>新建子分类</a>
                <span className="ant-divider" />
                <a onClick={() => Modal.confirm({
                  title: '删除确认',
                  content: `确定要删除 ${record.name} 吗`,
                  onOk() {
                    dispatch({ type: 'category/requestDeleteCategory', payload: record._id })
                  },
                })}
                >删除</a>
              </span>
            )
          }
          return (
            <span>
              <a onClick={() => dispatch({ type: 'category/editSubcategoryModal', payload: record })}>编辑</a>
              <span className="ant-divider" />
              <a onClick={() => Modal.confirm({
                title: '删除确认',
                content: `确定要删除 ${record.name} 吗`,
                onOk() {
                  dispatch({ type: 'category/requestDeleteSubcategory', payload: record._id })
                },
              })}
              >删除</a>
            </span>
          )
        },
      }]}
    />
    {/* <Modal
      title="Basic Modal"
      visible={category.categoryModal.visable}
      onCancel={() => dispatch({ type: 'category/clearModal' })}
    >
      <AddCategoryForm
        onValidSubmit={value => dispatch({ type: 'category/requestSaveCategory', payload: value })}
      />
    </Modal>*/}
    <CategoryModal
      title={category.categoryModal.mode === 'new' ? '创建一级分类' : '编辑一级分类'}
      okText={category.categoryModal.mode === 'new' ? '创建' : '修改'}
      visible={category.categoryModal.visible}
      initModel={category.categoryModal.model}
      confirmLoading={category.categoryModal.isLoading}
      onValidSubmit={category.categoryModal.mode === 'new'
        ? form => dispatch({ type: 'category/requestCreateCategory', payload: form })
        : form => dispatch({ type: 'category/requestUpdateCategory', payload: { ...category.categoryModal.model, ...form } })
      }
      onCancel={() => dispatch({ type: 'category/clearModal' })}
    />

    <CategoryModal
      title={category.subcategoryModal.mode === 'new' ? '创建二级分类' : '编辑二级分类'}
      okText={category.subcategoryModal.mode === 'new' ? '创建' : '修改'}
      categories={category.list}
      visible={category.subcategoryModal.visible}
      initModel={category.subcategoryModal.model}
      confirmLoading={category.subcategoryModal.isLoading}
      onValidSubmit={category.subcategoryModal.mode === 'new'
        ? form => dispatch({ type: 'category/requestCreateSubcategory', payload: form })
        : form => dispatch({ type: 'category/requestUpdateSubcategory', payload: { ...category.subcategoryModal.model, ...form } })
      }
      onCancel={() => dispatch({ type: 'category/clearModal' })}
    />
  </div>
)

export default connect(state => ({
  category: state.category,
}))(CategoryPage)
