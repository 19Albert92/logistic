import { createApp } from 'vue'
import App from './App.vue'
import debounce from "./helper/debounce.js";

const app = createApp(App)

app.directive('debounce', debounce);

app.mount('#app')
