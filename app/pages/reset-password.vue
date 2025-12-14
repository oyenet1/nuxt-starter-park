<template>
  <div
    class="min-h-screen bg-linear-to-br from-red-50 to-pink-100 flex items-center justify-center p-4"
  >
    <UCard class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="text-center">
          <UIcon
            name="i-heroicons-key"
            class="mx-auto h-12 w-12 text-primary"
          />
          <h1 class="text-2xl font-bold text-gray-900 mt-4">Reset Password</h1>
          <p class="text-gray-600">Enter your new password</p>
        </div>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 grid"
        @submit="onSubmit"
      >
        <UFormField size="xl" label="New Password" name="password">
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

        <UFormField size="xl" label="Confirm Password" name="confirmPassword">
          <UInput
            class="w-full"
            v-model="state.confirmPassword"
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
                aria-controls="confirmPassword"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton type="submit"> Reset Password </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  password: undefined,
  confirmPassword: undefined,
});

const toast = useToast();

const show = ref(false);

const { resetPassword } = useAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await resetPassword(event.data.password);
    toast.add({
      title: "Success",
      description: "Password reset successfully.",
      color: "success",
    });
    await navigateTo("/login");
  } catch (error: any) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Password reset failed.",
      color: "error",
    });
  }
}
</script>
