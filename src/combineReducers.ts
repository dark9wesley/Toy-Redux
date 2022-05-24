import { stringify } from "querystring"

function getUnexpectedStateShapeWarningMessage(
  state,
  reducers,
  action,
  unexpectedKeyCache
){
  const reducerKeys = Object.keys(reducers)
  const argumentName = 
  action && action.type === 'init' ? '调用createStore创建store时的参数' : 'reducer接收到的参数'

  if(reducerKeys.length === 0){
    return '没有有效的reducer，请确认调整'
  }

  const unexpectedKeys = Object.keys(state).filter(key => {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]
  })

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })
}

function assertReducerShape(reducers){
  Object.keys(reducers).forEach(key => {
    let reducer = reducers[key]

    const initState = reducer(undefined, { type: 'init' })

    if(typeof initState === 'undefined'){
      throw new Error(`${key}这个reducer没有设置默认返回值，请处理`)
    }

    if(typeof reducer(undefined, { type: 'random' }) === 'undefined'){
      throw new Error(`${key}这个reducer占用了redux的命名空间，请处理`)
    }
  })
}

function combineReducers(reducers){
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for(let i = 0; i < reducerKeys.length; i++){
    const key = reducerKeys[i]
    if(typeof reducers[key] === 'function'){
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  let unexpectedKeyCache = {}
  let shapeAssertion
  try{
    assertReducerShape(finalReducers)
  }catch(e){
    shapeAssertion = e
  }

  return (state, action) => {
    if(shapeAssertion){
      throw shapeAssertion
    }

    if(process.env.NODE_ENV !== 'production'){
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if(warningMessage){
        console.warn(warningMessage)
      }
    }

    let hasChanged = false
    const nextState = {}
    for(let i = 0; i < finalReducerKeys.length; i++){
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if(typeof nextStateForKey === 'undefined'){
        const actionType = action && action.type
        throw new Error(
          `当派发一个名为${actionType ? String(actionType) : '(unknown type)'}的action时，
          名为${key}的reducer返回了undefined，如果想忽略这个action，你必须显示返回上一个state，如果你想返回一个空值，请用null而不是undefine
        `)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length

    return hasChanged ? nextState : state
  }
}

export default combineReducers
