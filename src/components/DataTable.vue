<template>
  <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
    <table class="min-w-full">
      <thead class="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500">
        <tr>
          <slot name="head" />
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup>
// Dumb presentational table wrapper
</script>
