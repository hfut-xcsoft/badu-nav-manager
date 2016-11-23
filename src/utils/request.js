import fetch from 'dva/fetch'

function parseJSON(response) {
  if (response.status !== 204) {
    return response.json()
  }
  return ''
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  const token = sessionStorage.getItem('token')

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const fetchOption = {
    headers: {
      ...defaultHeaders,
      ...(options && options.headers) || {},
    },
    ...options,
  }

  return fetch(url, fetchOption)
    .then(checkStatus)
    .then(parseJSON)
}
