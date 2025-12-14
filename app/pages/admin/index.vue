<template>
  <div>
    <h2 class="text-3xl font-bold mb-4">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard>
        <h3 class="text-lg font-semibold">Total Users</h3>
        <p class="text-2xl font-bold text-primary">123</p>
      </UCard>
      <UCard>
        <h3 class="text-lg font-semibold">Active Sessions</h3>
        <p class="text-2xl font-bold text-primary">45</p>
      </UCard>
      <UCard>
        <h3 class="text-lg font-semibold">Revenue</h3>
        <p class="text-2xl font-bold text-primary">$12,345</p>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
});
</script>
