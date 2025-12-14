export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  // If not authenticated and trying to access protected route, redirect to login
  if (
    !isAuthenticated.value &&
    to.path !== "/login" &&
    to.path !== "/register" &&
    to.path !== "/forgot-password" &&
    to.path !== "/reset-password"
  ) {
    return navigateTo("/login");
  }

  // If authenticated and trying to access auth pages, redirect to home
  if (
    isAuthenticated.value &&
    (to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/forgot-password" ||
      to.path === "/reset-password")
  ) {
    return navigateTo("/");
  }
});
