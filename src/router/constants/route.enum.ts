export const enum CoreRouteNameEnum {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Home = 'home',
  Login = 'login',
  NotFound = 'notFound',
  Register = 'register',
}

export const enum CoreRoutePathEnum {
  Auth = '/auth',
  Dashboard = '/dashboard',
  Home = '/',
  Login = '/login',
  NotFound = '/:matches(.*)*',
  Register = '/register',
}
