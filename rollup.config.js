export default {
  input: './src/index.js', // 打包文件入口
  output: {
    file: 'dist/toy-redux.cjs.js', // 打包输出文件
    format: 'cjs', // 打包文件输出格式（commonjs是Nodejs的官方模块化规范）
  },
}
