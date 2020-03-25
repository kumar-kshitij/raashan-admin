import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const AdminList = React.lazy(() => import('./components/Admins/AdminList'));
const AddAdmin = React.lazy(() => import('./components/Admins/AddAdmin'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = {
  HOME: {
    path: '/',
    exact: true,
    name: 'Home'
  },
  DASHBOARD: {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  ADMIN_LIST: {
    path: '/admins',
    exact: true,
    name: 'Admins',
    component: AdminList,
  },
  ADD_ADMIN: {
    path: '/admins/add',
    exact: true,
    name: 'Add Admin',
    component: AddAdmin,
  },
};

export default routes;
