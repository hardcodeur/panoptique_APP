<script lang="ts">
	import { TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, List, Li } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { userSelectedStore } from "$lib/stores/form/agentStore";
	import { ProfileCardSolid,ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import FormAgent from "$lib/components/form/agents/FormAgent.svelte"

	let { userList,openDrawer } = $props();
	let searchTerm = $state('');
	let currentPosition = $state(0);
	const itemsPerPage = 10;
	const showPage = 5;
	let totalPages = $state(0);
	let pagesToShow: number[] = $state([]);
	let totalItems = userList.member.length;
	let startPage: number;
	let endPage: number = $state(10);

	const updateDataAndPagination = () => {
		let currentPageItems = userList.member.slice(currentPosition, currentPosition + itemsPerPage);
		renderPagination(currentPageItems.length);
	};

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < userList.member.length) {
			currentPosition += itemsPerPage;
			updateDataAndPagination();
		}
	};

	const loadPreviousPage = () => {
		if (currentPosition - itemsPerPage >= 0) {
			currentPosition -= itemsPerPage;
			updateDataAndPagination();
		}
	};

	const renderPagination = (totalItems: number) => {
		totalPages = Math.ceil(userList.member.length / itemsPerPage);
		const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

		startPage = currentPage - Math.floor(showPage / 2);
		startPage = Math.max(1, startPage);
		endPage = Math.min(startPage + showPage - 1, totalPages);

		pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	};

	const goToPage = (pageNumber: number) => {
		currentPosition = (pageNumber - 1) * itemsPerPage;
		updateDataAndPagination();
	};

	const userSelected = (user)=>{
		userSelectedStore.set(user);
	}

	let startRange = $derived(currentPosition + 1);
	let endRange = $derived(Math.min(currentPosition + itemsPerPage, totalItems));

	$effect(() => {
		// Call renderPagination when the component initially mounts
		renderPagination(userList.member.length);
	});

	let currentPageItems = $derived(userList.member.slice(currentPosition, currentPosition + itemsPerPage));
	let filteredItems = $derived(userList.member.filter((item) => item.fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1));

	let divClass = 'bg-white relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass = 'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/2 relative';
	let btnViewClass="ts-text-bold text-th-blue hover:text-th-white hover:bg-th-blue"
    let btnIconClass="mr-1"

</script>

<Section name="advancedTable" sectionClass="p-3 sm:p-5">
	<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass}>
		<TableHead>
			<TableHeadCell class="px-4 py-3" scope="col">Agent</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">Email</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">Equipe</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">Status</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">Role</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#if searchTerm !== ''}
				{#each filteredItems as item (item.id)}
					<TableBodyRow>
						<TableBodyCell class="px-4 py-3">{item.fullName}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.email}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.team}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.status}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.role}</TableBodyCell>
						<TableBodyCell class="px-4 py-3"><Button outline size="xs" class={btnViewClass} on:click={() => (openDrawer(FormAgent,`Agent - ${item.fullName}`),userSelected(item))}><ProfileCardSolid class={btnIconClass} />Profil</Button></TableBodyCell>
					</TableBodyRow>
				{/each}
			{:else}
				{#each currentPageItems as item (item.id)}
					<TableBodyRow>
						<TableBodyCell class="px-4 py-3">{item.fullName}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.email}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.team}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.status}</TableBodyCell>
						<TableBodyCell class="px-4 py-3">{item.role}</TableBodyCell>
						<TableBodyCell class="px-4 py-3"><Button outline size="xs" class={btnViewClass} on:click={() => (openDrawer(FormAgent,`Agent - ${item.fullName}`),userSelected(item))}><ProfileCardSolid class={btnIconClass} />Profil</Button></TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
		{#snippet footer()}
			<div class="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
				<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
					Showing
					<span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
					of
					<span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
				</span>
				<ButtonGroup>
					<Button onclick={loadPreviousPage} disabled={currentPosition === 0}><ChevronLeftOutline size="xs" class="m-1.5" /></Button>
					{#each pagesToShow as pageNumber}
						<Button onclick={() => goToPage(pageNumber)}>{pageNumber}</Button>
					{/each}
					<Button onclick={loadNextPage} disabled={totalPages === endPage}><ChevronRightOutline size="xs" class="m-1.5" /></Button>
				</ButtonGroup>
			</div>
		{/snippet}
	</TableSearch>
</Section>