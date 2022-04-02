import { defineConfig } from "rollup"

export default defineConfig([
  // Commonjs
  {
    input: './src/index.js', // 打包文件入口
    output: {
      file: 'lib/toy-redux.js', // 打包输出文件
      format: 'cjs', // 打包文件输出格式（commonjs是Nodejs的官方模块化规范）
    }
  },
])
