<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-white shadow-lg transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <div v-if="!collapsed" class="font-bold text-xl">SupaNuxt</div>
        <UButton
          @click="toggleSidebar"
          variant="ghost"
          size="sm"
          icon="i-heroicons-bars-3"
        />
      </div>
      <!-- Navigation -->
      <nav class="p-3 space-y-2">
        <UTooltip
          v-for="item in navigation"
          :key="item.name"
          :text="collapsed ? item.label : ''"
          :disabled="!collapsed"
        >
          <NuxtLink
            :to="item.to"
            :class="[
              'flex items-center space-x-3 p-3 rounded-lg transition-colors',
              $route.path === item.to
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-200',
            ]"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span v-if="!collapsed" class="font-medium">{{ item.label }}</span>
          </NuxtLink>
        </UTooltip>
      </nav>
    </div>
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <div class="flex items-center space-x-4">
            <span>Welcome, {{ user?.user_metadata.full_name }}</span>
            <UButton @click="logout" variant="outline">Logout</UButton>
          </div>
        </div>
      </header>
      <!-- Page content -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const collapsed = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

const navigation = [
  {
    name: "dashboard",
    label: "Dashboard",
    to: "/admin",
    icon: "i-heroicons-home",
  },
  {
    name: "users",
    label: "Users",
    to: "/admin/users",
    icon: "i-heroicons-users",
  },
  {
    name: "settings",
    label: "Settings",
    to: "/admin/settings",
    icon: "i-heroicons-cog-6-tooth",
  },
];

const { user, logout } = useAuth();

const { isMobile } = useDevice();

// Responsive: auto-collapse on mobile
onMounted(() => {
  const checkScreen = () => {
    if (isMobile) {
      collapsed.value = true;
    }
  };
  checkScreen();
  window.addEventListener("resize", checkScreen);
});
</script>
