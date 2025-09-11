<script lang="ts">
  import type { roleType } from "$lib/types";

    let {
      role,
      minRole
    }: {
      role: roleType,
      minRole: roleType
    }=$props();

    let hasAccess = $state(false);

    const roleHierarchy = {
      "admin" : 3,
      "manager" : 2,
      "team_manager" : 1,
      "agent" : 0
    }

    if(roleHierarchy[role] >= roleHierarchy[minRole]){
      hasAccess=true;
    }

  </script>

  {#if hasAccess}
    <slot />
  {/if}