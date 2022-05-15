import picgo from 'picgo'
import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'


function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const pluginConfig = ctx => {
  return [
    {
      name: 'prefix',
      type: 'input',
      alias: '文件名个性前缀格式(以/结尾)',
      default: ctx.getConfig('picgo-plugin-file-rename.prefix') || '',
      message: '例如 YYYY/MM/DD/',
      required: false
    }
  ]
}

export = (ctx: picgo) => {
  const register = () => {
    ctx.helper.beforeUploadPlugins.register('file-rename', {
      async handle(ctx: picgo) {
        // console.log(ctx)
        const autoRename = ctx.getConfig('settings.autoRename')
        if (autoRename) {
          ctx.emit('notification', {
            title: '❌ 警告',
            body: '请关闭 PicGo 的 【时间戳重命名】 功能,\nrename-file 插件重命名方式会被覆盖'
          })
          await sleep(10000)
          throw new Error('rename-file conflict')
        }
        const prefix: string = ctx.getConfig('picgo-plugin-file-rename.prefix') || ''
        ctx.output.map(output => {
          let fileHash = CryptoJS.MD5(output.buffer);
          output.fileName = `${fileHash}${output.extname}`
          if (prefix != '') {
            output.fileName = dayjs().format(prefix) + output.fileName
          }
        })
      },
      config: pluginConfig
    })
  }
  return {
    register,
    config: pluginConfig
  }
}
