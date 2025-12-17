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

    // Send welcome email
    try {
      await $fetch("/api/email/welcome", {
        method: "POST",
        body: { email, name },
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't throw, as registration succeeded
    }
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

    // Send password reset confirmation email
    try {
      const user = useSupabaseUser();
      await $fetch("/api/email/password-reset-confirmation", {
        method: "POST",
        body: {
          email: user.value?.email,
          name: user.value?.user_metadata?.name,
        },
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't throw, as reset succeeded
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await navigateTo("/login");
  };

  const sendOTP = async (email: string, otp: string) => {
    await $fetch("/api/email/otp", {
      method: "POST",
      body: { email, otp },
    });
  };

  const subscribeNewsletter = async (email: string, name?: string) => {
    await $fetch("/api/email/newsletter", {
      method: "POST",
      body: { email, name },
    });
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    sendOTP,
    subscribeNewsletter,
  };
};
