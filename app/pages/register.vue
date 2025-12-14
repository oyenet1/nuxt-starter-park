<template>
  <div
    class="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4"
  >
    <UCard class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="text-center">
          <UIcon
            name="i-heroicons-user-plus"
            class="mx-auto h-12 w-12 text-primary"
          />
          <h1 class="text-2xl font-bold text-gray-900 mt-4">Create Account</h1>
          <p class="text-gray-600">Join us today</p>
        </div>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 grid"
        @submit="onSubmit"
      >
        <UFormField size="xl" label="Name" name="name">
          <UInput class="w-full" v-model="state.name" />
        </UFormField>

        <UFormField size="xl" label="Email" name="email">
          <UInput class="w-full" v-model="state.email" type="email" />
        </UFormField>

        <UFormField size="xl" label="Password" name="password">
          <UInput
            class="w-full"
            v-model="state.password"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton type="submit"> Sign Up </UButton>
      </UForm>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <UButton @click="loginWithGoogle" variant="outline" size="lg" block>
            <UIcon name="i-logos-google-icon" class="mr-2 h-4 w-4" />
            Google
          </UButton>
          <UButton @click="loginWithGithub" variant="outline" size="lg" block>
            <UIcon name="i-logos-github-icon" class="mr-2 h-4 w-4" />
            GitHub
          </UButton>
        </div>
      </div>

      <template #footer>
        <div class="text-center">
          <div class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink
              to="/login"
              class="text-primary hover:underline font-medium"
              >Sign in</NuxtLink
            >
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  name: undefined,
  password: undefined,
});

const toast = useToast();

const show = ref(false);

const supabase = useSupabaseClient();

const { register } = useAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await register(
      event.data.email,
      event.data.password,
      event.data.name || undefined
    );
    toast.add({
      title: "Success",
      description: "Registered successfully.",
      color: "success",
    });
    await navigateTo("/");
  } catch (error: any) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Registration failed.",
      color: "error",
    });
  }
}

async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    toast.add({ title: "Error", description: error.message, color: "error" });
  }
}

async function loginWithGithub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    toast.add({ title: "Error", description: error.message, color: "error" });
  }
}
</script>
