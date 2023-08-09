<script lang="ts">
    import Album from '$lib/component/Album.svelte';

    export let data;
</script>

<svelte:head>
    <title>Fotók</title>
    <meta name="description" content="Fotók" />
</svelte:head>

<section class="px-[8rem]">
    <div class="flex justify-center">
        <h1
            class="text-dark text-[3rem] text-center my-[5rem] w-fit italic border-b-[3px] leading-tight"
        >
            katalógus
        </h1>
    </div>
    {#if data.albums}
        <div class="grid grid-flow-col auto-cols-auto gap-8">
            {#each data.albums as album}
                <Album {album} />
            {/each}
        </div>
    {/if}
</section>
