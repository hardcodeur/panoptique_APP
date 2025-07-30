<script lang="ts">
    import { userStore } from "$lib/stores/userFrontStore"
  
    let {
      role,
      anyRole
    } = $props<{
      role?: Role;
      anyRole?: Role[];
    }>();
    
    console.log("access composent hasAnyRole 3 ",userStore.hasAnyRole(...anyRole));
    const hasAccess = $derived(
      role ? userStore.hasRole(role) :
      anyRole?.length ? userStore.hasAnyRole(...anyRole) :
      true
    );
  </script>
  
  {#if hasAccess}
    <slot />
  {/if}