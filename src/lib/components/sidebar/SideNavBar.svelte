<script lang="ts">
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper } from 'flowbite-svelte';
    import { HomeSolid,AngleDownOutline,AngleUpOutline, BellSolid, UsersGroupSolid, RectangleListSolid, ChartPieSolid, UserSolid, EditOutline } from 'flowbite-svelte-icons';
    let spanClass :string = 'flex-1 ms-3 whitespace-nowrap';
    let activeClass :string = 'text-th-white bg-th-blue';
    let nonActiveClass :string ="hover:text-th-white hover:bg-th-blue"
    let iconeStyle :string ='transition duration-75 group-hover:text-th-white';
  </script>
  
<Sidebar>
    <SidebarWrapper divClass="border-r min-h-full border-th-black-light px-2 pt-3">
        <SidebarGroup>
            <SidebarItem label="Accueil" href="#" class="flex items-center p-2 text-th-black ts-text rounded-lg" {nonActiveClass} {activeClass} >
                <svelte:fragment slot="icon">
                    <HomeSolid class="w-6 h-6 {iconeStyle}" />
                </svelte:fragment>
            </SidebarItem>
            <SidebarDropdownWrapper label="Agents" btnClass="flex items-center p-2 w-full ts-text rounded-lg transition duration-75 group hover:bg-th-blue hover:text-th-white">
                <svelte:fragment slot="icon">
                    <UsersGroupSolid class="w-6 h-6  {iconeStyle}" />
                </svelte:fragment>
                <SidebarDropdownItem label="Agents" active={false} href="#" aClass="flex items-center p-2 ps-11 w-full text-th-black ts-text rounded-lg transition duration-75 group {nonActiveClass}" {activeClass} />
                <SidebarDropdownItem label="Equipe" active={false} href="#" aClass="flex items-center p-2 ps-11 w-full text-th-black ts-text rounded-lg transition duration-75 group {nonActiveClass}" {activeClass}/>
                <svelte:fragment slot="arrowup">
                    <AngleUpOutline class="w-5 h-5  {iconeStyle}" />
                </svelte:fragment>
                <svelte:fragment slot="arrowdown">
                    <AngleDownOutline class="w-5 h-5  {iconeStyle}" />
                </svelte:fragment>
            </SidebarDropdownWrapper>
            <SidebarDropdownWrapper label="Missions" btnClass="flex items-center p-2 w-full ts-text rounded-lg transition duration-75 group hover:bg-th-blue hover:text-th-white">
                <svelte:fragment slot="icon">
                    <RectangleListSolid class="w-6 h-6  {iconeStyle}" />
                </svelte:fragment>
                <SidebarDropdownItem label="Missions" active={false} href="#" aClass="flex items-center p-2 ps-11 w-full text-th-black ts-text rounded-lg transition duration-75 group {nonActiveClass}" {activeClass} />
                <SidebarDropdownItem label="Quarts" active={false} href="#" aClass="flex items-center p-2 ps-11 w-full text-th-black ts-text rounded-lg transition duration-75 group {nonActiveClass}" {activeClass} />
                <SidebarDropdownItem label="Lieux" active={false} href="#" aClass="flex items-center p-2 ps-11 w-full text-th-black ts-text rounded-lg transition duration-75 group {nonActiveClass}" {activeClass} />
                <svelte:fragment slot="arrowup">
                    <AngleUpOutline class="w-5 h-5  {iconeStyle}" />
                </svelte:fragment>
                <svelte:fragment slot="arrowdown">
                    <AngleDownOutline class="w-5 h-5  {iconeStyle}" />
                </svelte:fragment>
            </SidebarDropdownWrapper>
            <SidebarItem label="Notifications"  {spanClass} href="#" class="flex items-center p-2 text-th-black ts-text rounded-lg" {nonActiveClass} {activeClass}>
                <svelte:fragment slot="icon">
                    <BellSolid class="w-6 h-6 {iconeStyle}" />
                </svelte:fragment>
                <svelte:fragment slot="subtext">
                    <span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-bold text-th-white bg-th-red rounded-full"> 3 </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Statistiques" href="#" class="flex items-center p-2 text-th-black ts-text rounded-lg" {nonActiveClass} {activeClass} >
                <svelte:fragment slot="icon">
                    <ChartPieSolid class="w-6 h-6 {iconeStyle}" />
                </svelte:fragment>
            </SidebarItem>
            <SidebarGroup border borderClass="pt-4 mt-4 border-t border-th-black-light">
                <SidebarItem label="Profile" href="#" class="flex items-center p-2 text-th-black ts-text rounded-lg" {nonActiveClass} {activeClass} >
                    <svelte:fragment slot="icon">
                        <UserSolid class="w-6 h-6 {iconeStyle}" />
                    </svelte:fragment>
                </SidebarItem>
                <SidebarItem label="Déconnexion" href="#" class="flex items-center text-th-red hover:text-th-white hover:bg-th-red hover:p-2 transition duration-75 rounded-lg ts-text-bold" spanClass=""></SidebarItem>
            </SidebarGroup>
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>