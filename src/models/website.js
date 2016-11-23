import pathToRegexp from 'path-to-regexp'
import {
  fetchWebsiteList,
  createWebsite,
  updateWebsite,
  deleteWebsite,
} from '../services/api'

export default {
  namespace: 'website',
  state: {
    list: [],
    isLoading: false,
    modal: {
      mode: 'new',
      model: {},
      visible: false,
      isLoading: false,
    },
  },
  reducers: {
    saveList(state, { payload: websites }) {
      return {
        ...state,
        list: websites,
        isLoading: false,
      }
    },
    save(state, { payload }) {
      return {
        ...state,
        list: [
          ...state.list,
          payload,
        ],
      }
    },
    update(state, { payload }) {
      const index = state.list.findIndex(item => item._id === payload._id)
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          payload,
          ...state.list.slice(index + 1),
        ],
      }
    },
    remove(state, { payload: websiteId }) {
      const index = state.list.findIndex(item => item._id === websiteId)
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          ...state.list.slice(index + 1),
        ],
      }
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        isLoading: payload,
      }
    },
    newModal(state) {
      return {
        ...state,
        modal: {
          ...state.modal,
          mode: 'new',
          visible: true,
          model: {},
        },
      }
    },
    editModal(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          mode: 'edit',
          visible: true,
          model: payload,
        },
      }
    },
    clearModal(state) {
      return {
        ...state,
        modal: {
          mode: 'new',
          model: {},
          visible: false,
          isLoading: false,
        },
      }
    },
    setConfirmLoading(state, { payload }) {
      return {
        ...state,
        modal: {
          ...state.modal,
          isLoading: payload,
        },
      }
    },
  },
  effects: {
    * fetchList(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true })
        yield put({ type: 'category/fetchList' })
        const websites = yield call(fetchWebsiteList)
        yield put({ type: 'saveList', payload: websites })
      } catch (e) {
        console.log(e)
      }
    },
    * requestCreateWebsite({ payload }, { call, put }) {
      try {
        yield put({ type: 'setConfirmLoading', payload: true })
        const website = yield call(createWebsite, { ...payload, subcategory: payload.subcategory[1] })
        yield put({ type: 'save', website })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
    * requestUpdateWebsite({ payload }, { call, put }) {
      try {
        yield put({ type: 'setConfirmLoading', payload: true })
        const website = yield call(updateWebsite, { ...payload, subcategory: payload.subcategory[1] })
        yield put({ type: 'update', payload: website })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
    * requestDeleteWebsite({ payload }, { call, put }) {
      try {
        yield put({ type: 'setConfirmLoading', payload: true })
        yield call(deleteWebsite, payload)
        yield put({ type: 'remove', payload })
      } catch (e) {
        console.log(e)
      }
    },

  },
  subscriptions: {
    router({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/websites').exec(pathname)
        if (match) {
          dispatch({ type: 'fetchList' })
        }
      })
    },
  },
}
