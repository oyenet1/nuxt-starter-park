export const useAuth = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  const isAuthenticated = computed(() => !!user.value);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) throw error;
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const resetPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await navigateTo("/login");
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };
};
