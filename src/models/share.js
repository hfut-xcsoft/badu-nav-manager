import pathToRegexp from 'path-to-regexp'
import {
  fetchShareList,
  updateShare,
} from '../services/api'

export default {
  namespace: 'share',
  state: {
    list: [],
    isLoading: false,
    modal: {
      visible: false,
      isLoading: false,
      model: {},
    },
  },
  reducers: {
    saveList(state, { payload: shares }) {
      return {
        ...state,
        list: shares,
        isLoading: false,
      }
    },
    updateShare(state, { payload }) {
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
    setLoading(state, { payload }) {
      return {
        ...state,
        isLoading: payload,
      }
    },
    clearModal(state) {
      return {
        ...state,
        modal: {
          visible: false,
          isLoading: false,
          model: {},
        },
      }
    },
    openModal(state, { payload }) {
      return {
        ...state,
        modal: {
          visible: true,
          model: {
            _id: payload._id,
            name: payload.name,
            url: payload.url,
            description: payload.description,
            recommend_by: payload.email,
          },
        },
      }
    },
  },
  effects: {
    * fetchList(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true })
        const shares = yield call(fetchShareList)
        yield put({ type: 'saveList', payload: shares })
      } catch (e) {
        console.log(e)
      }
    },
    * requestUpdateShare({ payload }, { call, put }) {
      try {
        const share = yield call(updateShare, payload)
        yield put({ type: 'updateShare', payload: share })
      } catch (e) {
        console.log(e)
      }
    },
    * requestUpdateStatus({ payload: { _id, status } }, { put, select }) {
      try {
        const share = yield select(state => state.list.find(item => item.id === _id))
        yield put({ type: 'requestUpdateShare', payload: { ...share, status } })
      } catch (e) {
        console.log(e)
      }
    },
    * requestEmbodyShare({ payload }, { call, put }) {
      try {
        const share = yield call(updateShare, { ...payload, subcategory: payload.subcategory[1], status: 3 })
        yield put({ type: 'updateShare', payload: share })
        yield put({ type: 'clearModal' })
      } catch (e) {
        console.log(e)
      }
    },
  },
  subscriptions: {
    router({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/shares').exec(pathname)
        if (match) {
          dispatch({ type: 'fetchList' })
          dispatch({ type: 'category/fetchList' })
        }
      })
    },
  },
}
