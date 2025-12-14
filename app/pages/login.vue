<template>
  <div
    class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <UCard class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="text-center">
          <UIcon
            name="i-heroicons-lock-closed"
            class="mx-auto h-12 w-12 text-primary"
          />
          <h1 class="text-2xl font-bold text-gray-900 mt-4">Welcome Back</h1>
          <p class="text-gray-600">Sign in to your account</p>
        </div>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 grid"
        @submit="onSubmit"
      >
        <UFormField size="xl" label="Email" name="email">
          <UInput class="w-full" v-model="state.email" />
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

        <UButton type="submit" size="xl" block> Sign In </UButton>
      </UForm>
      <template #footer>
        <div class="text-center space-y-2">
          <NuxtLink
            to="/forgot-password"
            class="text-sm text-primary hover:underline"
            >Forgot your password?</NuxtLink
          >
          <div class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="text-primary hover:underline font-medium"
              >Sign up</NuxtLink
            >
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();

const show = ref(false);

const { login } = useAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await login(event.data.email, event.data.password);
    toast.add({
      title: "Success",
      description: "Logged in successfully.",
      color: "success",
    });
    await navigateTo("/");
  } catch (error: any) {
    console.error(error);
    toast.add({ title: "Error", description: "Login failed.", color: "error" });
  }
}
</script>
