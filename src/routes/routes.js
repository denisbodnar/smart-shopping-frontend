import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Hello from "../components/Hello.vue";
import OAuthCallback from "../components/OAuthCallback.vue";

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
  {
    path: "/hello",
    name: "Hello",
    component: Hello,
  },
  {
    path: "/oauth/callback",
    name: "OAuthCallback",
    component: OAuthCallback,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
