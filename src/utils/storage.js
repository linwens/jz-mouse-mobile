export function setStorageItem(key, value) {
  sessionStorage.setItem(key, value)
}

export function getStorageItem(key) {
  const value = sessionStorage.getItem(key)
  return JSON.parse(value)
}

export function removeStorageItem(key) {
  sessionStorage.removeItem(key)
}

export function setLocalStorageItem(key, value) {
  localStorage.setItem(key, value)
}

export function getLocalStorageItem(key) {
  const value = localStorage.getItem(key)
  return JSON.parse(value)
}

export function removeLocalStorageItem(key) {
  localStorage.removeItem(key)
}
