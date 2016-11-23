import request from '../utils/request'

export const API_BASE = '/api'

export async function fetchCategoryList() {
  return request('/api/categories')
}
export async function fetchSubcategoryList() {
  return request('/api/subcategories')
}

export async function fetchAuthorization(username, password) {
  return request('/api/admins/authorization', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  })
}

export async function createCategory(category) {
  return request(`${API_BASE}/categories`, {
    method: 'POST',
    body: JSON.stringify(category),
  })
}

export async function updateCategory(category) {
  return request(`${API_BASE}/categories/${category._id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  })
}

export async function deleteCategory(categoryId) {
  return request(`${API_BASE}/categories/${categoryId}`, {
    method: 'DELETE',
  })
}

export async function createSubcategory(subcategory) {
  return request(`${API_BASE}/subcategories`, {
    method: 'POST',
    body: JSON.stringify(subcategory),
  })
}

export async function updateSubcategory(subcategory) {
  return request(`${API_BASE}/subcategories/${subcategory._id}`, {
    method: 'PUT',
    body: JSON.stringify(subcategory),
  })
}

export async function deleteSubcategory(subcategoryId) {
  return request(`${API_BASE}/subcategories/${subcategoryId}`, {
    method: 'DELETE',
  })
}


export async function fetchWebsiteList() {
  return request(`${API_BASE}/websites`)
}

export async function createWebsite(website) {
  return request(`${API_BASE}/websites`, {
    method: 'POST',
    body: JSON.stringify(website),
  })
}

export async function updateWebsite(website) {
  return request(`${API_BASE}/websites/${website._id}`, {
    method: 'PUT',
    body: JSON.stringify(website),
  })
}

export async function deleteWebsite(websiteId) {
  return request(`${API_BASE}/websites/${websiteId}`, {
    method: 'DELETE',
  })
}

export async function fetchShareList() {
  return request(`${API_BASE}/submits`)
}

export async function updateShare(share) {
  return request(`${API_BASE}/submits/${share._id}`, {
    method: 'PUT',
    body: JSON.stringify(share),
  })
}
