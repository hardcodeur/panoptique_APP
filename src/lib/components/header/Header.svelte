<script lang="ts">
import logo from "$lib/assets/logo/panoptique_logo_white.svg";
import userPict from "$lib/assets/emptyImage_trash.svg";
import { Navbar, NavBrand, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
</script>

<header>
  <Navbar class="bg-th-blue" fluid>
    <NavBrand href="/">
      <img src="{logo}" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
    </NavBrand>
    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" src="{userPict}" />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
        <span class="block ts-text">Bonnie Green</span>
        <span class="block ts-text">name@flowbite.com</span>
      </DropdownHeader>
      <DropdownItem>Profile</DropdownItem>
      <DropdownDivider />
      <DropdownItem>Déconnexion</DropdownItem>
    </Dropdown>
  </Navbar>
</header>