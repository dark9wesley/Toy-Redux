function bindActionCreator(actionCreator, dispatch){
  return function(this, ...args){
    return dispatch(actionCreator.apply(this, args))
  }
}


function bindActionCreators(actionCreators, dispatch){
  if(typeof actionCreators === 'function'){
    return bindActionCreator(actionCreators, dispatch)
  }

  if(typeof actionCreators !== 'object' || actionCreators === null){
    throw new Error('bindActionCreators希望传入一个对象或者函数')
  }

  const boundActionCreators = {}
  for(const key in actionCreators){
    const actionCreator = actionCreators[key]
    if(typeof actionCreator === 'function'){
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

export default bindActionCreators
