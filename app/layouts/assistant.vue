<template>
  <div class="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
    <AppHeader />
    <main class="flex-1 w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
      <slot />
    </main>
  </div>
</template>
