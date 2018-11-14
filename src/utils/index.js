export default {
  // 获得配置文件信息
  getConfig (key) {
    return process.env[key]
  }
}
