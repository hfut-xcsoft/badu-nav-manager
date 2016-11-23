import { browserHistory } from 'dva/router'
import { fetchAuthorization } from '../services/api'

export default {
  namespace: 'app',
  state: {
  },
  reducers: {},
  effects: {
    * doAuth({ payload: { username, password } }, { call }) {
      try {
        const data = yield call(fetchAuthorization, username, password)
        console.log(data, data.token)
        if (data && data.token) {
          sessionStorage.setItem('token', data.token)
          browserHistory.push('/')
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
  subscriptions: {
    checkAuth({ history }) {
      history.listen(({ pathname }) => {
        if (/^\/login/.test(pathname)) {
          if (sessionStorage.getItem('token')) {
            history.push('/')
          }
        } else if (!sessionStorage.getItem('token')) {
          history.push('/login')
        }
      })
    },
  },
}
