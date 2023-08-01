import { createRouter, createWebHistory } from 'vue-router';
import UserList from '../views/user/list.vue';
import Register from '../views/user/register.vue';
const routes = [
    {
        path: '/',
        redirect: '/register'
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/user/list',
        name: 'UserList',
        component: UserList
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;