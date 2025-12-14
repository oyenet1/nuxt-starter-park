<template>
  <div
    class="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4"
  >
    <UCard class="w-full max-w-md shadow-lg text-center">
      <UIcon name="i-heroicons-home" class="mx-auto h-12 w-12 text-primary" />
      <h1 class="text-2xl font-bold text-gray-900 mt-4">Welcome to SupaNuxt</h1>
      <p class="text-gray-600 mb-4">
        Your authentication is powered by Supabase
      </p>
      <div v-if="isAuthenticated">
        <h1 class="text-lg">Hello, {{ user?.user_metadata.full_name }}</h1>
        <p>Email: {{ user.email }}</p>
        <div></div>
        <UButton @click="logout" class="mt-4" size="lg">Logout</UButton>
      </div>
      <div v-else>
        <p class="mb-4">Please sign in to continue</p>
        <NuxtLink to="/login">
          <UButton size="lg">Get Started</UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const { user, isAuthenticated, logout } = useAuth();
</script>
