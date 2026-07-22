<template>
  <div class="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
    <AppSidebar />

    <!-- Main Workspace Container -->
    <div class="flex-1 h-full flex flex-col min-w-0 overflow-hidden md:pl-64">
      <AppTopbar />

      <main class="flex-1 w-full max-w-[98%] mx-auto px-3 sm:px-6 py-4 overflow-hidden h-[calc(100vh-4rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
