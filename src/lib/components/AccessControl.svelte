<script lang="ts">
    let {
      role,
      anyRole
    } = $props<{
      role?: Role;
      anyRole?: Role[];
    }>();
    
    const hasAccess = $derived(
      role ? userStore.hasRole(role) :
      anyRole?.length ? userStore.hasAnyRole(...anyRole) :
      true
    );
  </script>
  
  {#if hasAccess}
    <slot />
  {/if}