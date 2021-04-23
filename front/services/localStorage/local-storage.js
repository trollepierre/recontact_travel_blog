const getInLocalStorage = key => window.localStorage.getItem(key)
const removeInLocalStorage = key => window.localStorage.removeItem(key)
const saveInLocalStorage = (key, value) => window.localStorage.setItem(key, value)
const reloadPage = () => window.location.reload()

export {
  getInLocalStorage,
  removeInLocalStorage,
  saveInLocalStorage,
  reloadPage,
}
