import { setupVab } from '~/library'
import App from './App.vue'
import { setupRouter } from '/@/router'
import { setupStore } from '/@/store'

const app = createApp(App)

setupVab(app)
setupStore(app)
setupRouter(app)

app.mount('#app')
