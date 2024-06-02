import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: "/", component: "Chat/Chat" },
    { path: "/register", component: "Register/Register" },
    { path: "/login", component: "Login/Login" },
    { path: "/change-password", component: "ChangePassword/ChangePassword" },
  ],
  npmClient: 'pnpm',
});
