import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Hello from "../components/Hello.vue";
import OAuthCallback from "../components/OAuthCallback.vue";
import NewUserWizard from "@/components/NewUserWizard.vue";

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
  {
    path: "/new-user-wizard",
    name: "NewUserWizard",
    component: NewUserWizard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
