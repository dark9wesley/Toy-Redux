function createStore(reducer, preloadedState, enhancer){
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ){
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.'
    )
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if(typeof enhancer !== 'undefined'){
    if (typeof enhancer !== 'function') {
      throw new Error(`Expected the enhancer to be a function`)
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error(`Expected the root reducer to be a function`)
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  const ensureCanMutateNextListeners = () => {
    if(currentListeners === nextListeners){
      nextListeners = currentListeners.slice()
    }
  }

  const getStates = () => {
    if(isDispatching){
      throw new Error("Don't use getState()  method while reducer working")
    }
    return currentState
  }

  const subScribe = (listener) => {
    if(typeof listener !== 'function'){
      throw new Error('listener must be a function')
    }

    if(isDispatching){
      throw new Error("Don't use subScribe()  method while reducer working")
    }
    
    let isSubscribed = true

    ensureCanMutateNextListeners()

    nextListeners.push(listener)

    return function unsubscribe(){
      if(!isSubscribed) return

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ')
      }

      isSubscribed = false

      ensureCanMutateNextListeners()

      let index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }

  const dispatch = (action) => {
    if(typeof action.type === 'undefined'){
      throw new Error('action must have a type ')
    }

    if(isDispatching){
      throw new Error("Don't use dispatch()  method while reducer working")
    }

    try{
      isDispatching = true
      currentState =  currentReducer(currentState, action)
    }finally{
      isDispatching = false
    }

    const listeners = (currentListeners = nextListeners)
    for(let i = 0; i < listeners.length; i++){
      const listener = listeners[i]
      listener()
    }

    return action
  }

  const replaceReducer = (nextReducer) => {
    if(typeof nextReducer !== 'function'){
      throw new Error('reducer must be a function')
    }

    currentReducer = nextReducer

    dispatch({type: 'replace'})

    return store
  }

  dispatch({type: 'init'})

  const store = {
    getStates, 
    dispatch,
    subScribe,
    replaceReducer,
  }

  return store
}

export default createStore
