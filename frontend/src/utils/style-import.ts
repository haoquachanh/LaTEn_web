import type { App } from 'vue'
import { ElIcon, ElLoading, ElCard, ElButton } from 'element-plus'

export default function styleImport(app: App) {
  ;[ElButton, ElCard, ElLoading, ElIcon].forEach((v) => {
    app.use(v)
  })
  return app
}
