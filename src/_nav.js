import ROUTES from './routes';

export default {
  items: [
    {
      name: 'Dashboard',
      url: ROUTES.DASHBOARD.path,
      icon: 'icon-tachometer',
    },
		{
			name: 'Admins',
			url: ROUTES.ADMIN_LIST.path,
			icon: 'fa fa-user-secret',
			children: [
				{
					name: 'Admin List',
					url: ROUTES.ADMIN_LIST.path,
					icon: 'fa fa-list-alt',
				},
				{
					name: 'Add Admin',
					url: ROUTES.ADD_ADMIN.path,
					icon: 'fa fa-user-plus',
				},
			],
		},
  ],
};
