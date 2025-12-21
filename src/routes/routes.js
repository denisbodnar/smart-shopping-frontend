import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Hello from "../components/Hello.vue";
import OAuthCallback from "../components/OAuthCallback.vue";
import NewUserWizard from "@/components/NewUserWizard.vue";
import ShoesCatalog from "@/components/ShoesCatalog.vue";
import Favorites from "@/components/Favorites.vue";

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
  {
    path: "/shoes",
    name: "Shoes",
    component: ShoesCatalog,
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: Favorites,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("auth_token") || null;

  if (to.name === "SignIn" && token) {
    return { name: "Shoes" };
  }

  return true;
});

export default router;
