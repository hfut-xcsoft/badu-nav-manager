import React, { PropTypes } from 'react'
import { Router } from 'dva/router'
import MenuFramework from './routes/MenuFramework'
import Example from './components/Example'
import LoginPage from './routes/LoginPage'
import CategoryPage from './routes/CategoryPage'
import WebsitePage from './routes/WebsitePage'
import SharePage from './routes/SharePage'

const routes = [
  {
    path: '/',
    component: MenuFramework,
    indexRoute: { component: Example },
    childRoutes: [
      { path: 'categories', components: CategoryPage },
      { path: 'websites', components: WebsitePage },
      { path: 'shares', components: SharePage },
    ],
  },
  {
    path: '/login',
    component: LoginPage,
  },
]

const AppRouter = ({ history }) => (
  <Router
    history={history}
    routes={routes}
  />
)

AppRouter.propTypes = {
  history: PropTypes.object,
}

export default AppRouter
