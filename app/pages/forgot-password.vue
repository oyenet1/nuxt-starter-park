<template>
  <div
    class="min-h-screen bg-linear-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4"
  >
    <UCard class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="text-center">
          <UIcon
            name="i-heroicons-question-mark-circle"
            class="mx-auto h-12 w-12 text-primary"
          />
          <h1 class="text-2xl font-bold text-gray-900 mt-4">Forgot Password</h1>
          <p class="text-gray-600">We'll send you a reset link</p>
        </div>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 grid"
        @submit="onSubmit"
      >
        <UFormField size="xl" label="Email" name="email">
          <UInput
            icon="material-symbols:mail"
            class="w-full"
            v-model="state.email"
            type="email"
          />
        </UFormField>

        <UButton type="submit" block size="xl" :loading="isLoading">
          Send Reset Email
        </UButton>
      </UForm>
      <template #footer>
        <div class="text-center">
          <div class="text-sm text-gray-600">
            Remember your password?
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
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
});

const toast = useToast();

const isLoading = ref(false);

const { forgotPassword } = useAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  try {
    await forgotPassword(event.data.email);
    toast.add({
      title: "Success",
      description: "Reset email sent.",
      color: "success",
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Failed to send reset email.",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
