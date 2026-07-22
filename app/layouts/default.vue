<template>
  <div class="min-h-screen bg-background text-foreground font-sans flex flex-col">
    <AppSidebar />

    <!-- Main Workspace Container -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-64">
      <AppTopbar />

      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </main>

      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
