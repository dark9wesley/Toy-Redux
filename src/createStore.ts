function createStore(reducer: any, preloadedState: any, enhancer: any){
  let state = preloadedState;
  let currentReducer = reducer;
  let currentListener = [];
  let nextListener = currentListener;
  let isDispatching = false;

  const ensureLister = () => {
    if(currentListener === nextListener){
      nextListener = currentListener.slice()
    }
  }

  const getStates = () => {
    return state
  }

  const dispatch = (action) => {
    if(typeof action.type === 'undefined'){
      throw new Error('action must have a type ')
    }

    try{
      isDispatching = true
      state =  currentReducer(state, action)
    }finally{
      isDispatching = false
    }

    const listener = (currentListener = nextListener)
    for(let i = 0; i < listener.length; i++){
      listener[i]()
    }
  }

  const subScribe = (listener) => {
    if(typeof listener !== 'function'){
      throw new Error('listener must be a function')
    }
    
    let isSubscribe = true

    ensureLister()

    nextListener.push(listener)

    return () => {
      if(!isSubscribe) return

      ensureLister()

      let index = nextListener.indexOf(listener)
      nextListener.splice(index, 1)
    }
  }

  const replaceReducer = () => {

  }

  return {
    getStates, 
    dispatch,
    subScribe,
    replaceReducer,
  }
}

export default createStore
