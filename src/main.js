import "./assets/main.css";
import "vue3-toastify/dist/index.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes/routes";

const app = createApp(App);

app.use(router);
app.mount("#app");
