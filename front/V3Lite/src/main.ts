import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import { setupRouter } from './app/router/setup-router'
import { pinia, setupStore } from './stores'
import { useThemeStore } from './stores/theme'
import './styles/tailwind.css'
import './styles/index.scss'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)
  useThemeStore(pinia).initializeTheme()
  setupDirectives(app)
  await setupRouter(app)

  app.mount('#app')
}

void bootstrap()
