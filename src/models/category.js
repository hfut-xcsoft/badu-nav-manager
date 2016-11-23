import pathToRegexp from 'path-to-regexp'
import {
  fetchCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../services/api'


export default {
  namespace: 'category',
  state: {
    list: [],
    isLoading: false,
    categoryModal: {
      visible: false,
      isLoading: false,
      model: {},
    },
    subcategoryModal: {
      visible: false,
      isLoading: false,
      model: {},
    },
  },
  reducers: {
    createCategory(state, { payload: category }) {
      return {
        ...state,
        list: [
          ...state.list,
          { ...category, children: [] },
        ],
      }
    },
    updateCategory(state, { payload: category }) {
      const index = state.list.findIndex(item => item._id === category._id)
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          { ...category, children: category.subcategories },
          ...state.list.slice(index + 1),
        ],
      }
    },
    deleteCategory(state, { payload }) {
      const index = state.list.findIndex(item => item._id === payload)
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          ...state.list.slice(index + 1),
        ],
      }
    },
    saveList(state, { payload: categories }) {
      return {
        ...state,
        list: categories.map(category => ({ ...category, children: category.subcategories })),
        isLoading: false,
      }
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        isLoading: payload,
      }
    },
    clearModal(state) {
      return {
        ...state,
        categoryModal: {
          visible: false,
          isLoading: false,
          model: {},
        },
        subcategoryModal: {
          visible: false,
          isLoading: false,
          model: {},
        },
      }
    },
    newCategoryModal(state) {
      return {
        ...state,
        categoryModal: {
          visible: true,
          mode: 'new',
          model: {},
        },
      }
    },
    editCategoryModal(state, { payload }) {
      return {
        ...state,
        categoryModal: {
          visible: true,
          mode: 'edit',
          model: payload,
        },
      }
    },
    categoryModalLoading(state, { payload }) {
      return {
        ...state,
        categoryModal: {
          ...state.categoryModal,
          isLoading: payload,
        },
      }
    },
    newSubcategoryModal(state, { payload: categoryId }) {
      return {
        ...state,
        subcategoryModal: {
          visible: true,
          mode: 'new',
          model: {
            category: categoryId,
          },
        },
      }
    },
    editSubcategoryModal(state, { payload }) {
      return {
        ...state,
        subcategoryModal: {
          visible: true,
          mode: 'edit',
          model: payload,
        },
      }
    },
    subcategoryModalLoading(state, { payload }) {
      return {
        ...state,
        subcategoryModal: {
          ...state.categoryModal,
          isLoading: payload,
        },
      }
    },
  },
  effects: {
    * fetchList(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true })
        const categories = yield call(fetchCategoryList)
        yield put({ type: 'saveList', payload: categories })
      } catch (e) {
        console.log(e)
      }
    },
    * requestCreateCategory({ payload }, { call, put }) {
      try {
        yield put({ type: 'categoryModalLoading', payload: true })
        const category = yield call(createCategory, payload)
        yield put({ type: 'createCategory', payload: category })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
    * requestUpdateCategory({ payload }, { call, put }) {
      try {
        yield put({ type: 'categoryModalLoading', payload: true })
        const category = yield call(updateCategory, payload)
        yield put({ type: 'updateCategory', payload: category })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
    * requestDeleteCategory({ payload }, { call, put }) {
      try {
        yield call(deleteCategory, payload)
        yield put({ type: 'deleteCategory', payload })
      } catch (e) {
        console.log(e)
      }
    },
    * requestCreateSubcategory({ payload }, { call, put }) {
      try {
        yield put({ type: 'subcategoryModalLoading', payload: true })
        yield call(createSubcategory, payload)
        yield put({ type: 'fetchList' })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
    * requestUpdateSubcategory({ payload }, { call, put }) {
      try {
        yield put({ type: 'subcategoryModalLoading', payload: true })
        yield call(updateSubcategory, payload)
        yield put({ type: 'fetchList' })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
    * requestDeleteSubcategory({ payload }, { call, put }) {
      try {
        yield call(deleteSubcategory, payload)
        yield put({ type: 'fetchList' })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
  },
  subscriptions: {
    router({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/categories').exec(pathname)
        if (match) {
          dispatch({ type: 'fetchList' })
        }
      })
    },
  },
}
