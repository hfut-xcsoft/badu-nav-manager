import pathToRegexp from 'path-to-regexp'
import { fetchSubcategoryList } from '../services/api'


export default {
  namespace: 'subcategory',
  state: {
    list: [],
    data: {},
    isLoading: false,
  },
  reducers: {
    save(state, { payload: subcategory }) {
      return {
        ...state,
        list: [
          ...state.list,
          subcategory,
        ],
      }
    },
    saveList(state, { payload: subcategories }) {
      return {
        ...state,
        list: subcategories,
        isLoading: false,
      }
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        isLoading: payload,
      }
    },
  },
  effects: {
    * fetchList(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true })
        const subcategories = yield call(fetchSubcategoryList)
        yield put({ type: 'saveList', payload: subcategories })
      } catch (e) {
        console.log(e)
      }
    },
  },
  subscriptions: {
    router({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/subcategories').exec(pathname)
        if (match) {
          dispatch({ type: 'fetchList' })
        }
      })
    },
  },
}
