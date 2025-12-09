import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";

const routes = [
  {
    path: "/",
    redirect: "/sign-in",
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: Login,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
