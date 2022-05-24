import compose from "./compose"

function applyMiddleware(...middleWares){
  return (createStore) => {
    return (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState)

      let dispatch = () => {
        throw new Error('请勿在中间件构建时调用dispatch')
      }

      const middleWareApi = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args),
      }

      const chain = middleWares.map(middleWare => middleWare(middleWareApi))

      dispatch = compose(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
  }
}

export default applyMiddleware
