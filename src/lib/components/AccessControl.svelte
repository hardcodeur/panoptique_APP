<script lang="ts">
    import { authUserStore, type Role } from '$lib/stores/authUserStore';
  
    let {
      role,
      anyRole
    } = $props<{
      role?: Role;
      anyRole?: Role[];
    }>();
  
    const hasAccess = $derived(
      role ? authUserStore.hasRole(role) :
      anyRole?.length ? authUserStore.hasAnyRole(...anyRole) :
      true
    );
  </script>
  
  {#if hasAccess}
    <slot />
  {/if}