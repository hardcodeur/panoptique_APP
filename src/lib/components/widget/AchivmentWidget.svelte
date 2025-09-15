<script lang="ts">
	import { string } from "zod";

    let {
        value,
        text
    }: {value: string,
        text: string}=$props();


</script>

<div class="border border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col w-full justify-between items-center">
        <div class="p-10 flex w-full flex-row justify-center items-center">
            <span class="ts-title-1 text-th-red">{value}</span>
        </div>
        <div class="p-4 h-fit w-full border-t bg-white rounded-b-lg border-th-black-light">
            <p class="text-th-blue ts-text-sub-title text-center align-middle">{text}</p>
        </div>
    </div>
</div>