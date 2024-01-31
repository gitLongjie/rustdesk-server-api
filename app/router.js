/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/api/heartbeat', controller.api.heartbeat);
  router.post('/api/reg', controller.api.register);
  router.post('/api/login', controller.api.login);
  router.post('/api/logout', controller.api.logout);
  router.get('/api/users', controller.api.Users);
  router.post('/api/currentUser', controller.api.currentUser);
  router.get('/api/peers', controller.api.Users);
  router.post('/api/sysinfo', controller.api.sysinfo);
  router.get('/api/ab', controller.api.ab_get);
  router.post('/api/ab', controller.api.ab);
};
