import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: "/", component: "Chat/Chat" },
    { path: "/login", component: "Login/Login" },
    { path: "/register", component: "Register/Register" },
  ],
  npmClient: 'pnpm',
});
