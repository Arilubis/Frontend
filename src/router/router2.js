// src/router/router2.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Minimal</div>' } }],
});

export default router;