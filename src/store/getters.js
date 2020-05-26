const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  cacheMouseInfo: state => state.app.cacheMouseInfo,
  addingMouses: state => state.app.addingMouses,
  addingChildMouse: state => state.app.addingChildMouse,
  addingExpt: state => state.app.addingExpt,
  addingBreed: state => state.app.addingBreed,
  token: state => state.user.token,
  info: state => state.user.info,
  inputHistory: state => state.user.inputHistory,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
