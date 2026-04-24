import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import { setupRouter } from './app/router/setup-router'
import { setupStore } from './stores'
import 'element-plus/dist/index.css'
import './styles/tailwind.css'
import './styles/index.scss'

async function bootstrap() {
  const app = createApp(App)

  app.use(ElementPlus)
  setupStore(app)
  await setupRouter(app)

  app.mount('#app')
}

void bootstrap()
