export default defineNuxtRouteMiddleware((to, _from) => {
  const session = useSupabaseSession();

  if (!session.value) {
    return navigateTo('/login');
  }
})
// This middleware checks if the user is authenticated by checking the Supabase session.