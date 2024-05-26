import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/login", component: "Login/Login" },
    { path: "/register", component: "Register/Register" },
    { path: "/chat", component: "Chat/Chat" },
  ],
  npmClient: 'pnpm',
});
