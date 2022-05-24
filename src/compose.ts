function compose(...funs){
  if(funs.length === 0){
    return (args) => args 
  }

  if(funs.length === 1){
    return funs[0]
  }

  return funs.reduce((a, b) => (...args) => a(b(...args)))
}

export default compose
