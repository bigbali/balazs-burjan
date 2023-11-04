<script lang="ts">
    import Album from '$lib/component/Album.svelte';
    import Heading from '$lib/component/Heading.svelte';
    import Page from '$lib/component/Page.svelte';
    import Error from '$lib/component/Error.svelte';
    import Separator from '$lib/component/Separator.svelte';

    export let data;
    let download_failed = false;

    $: if (download_failed) {
        setTimeout(() => (download_failed = false), 3000);
    }
</script>

<svelte:head>
    <title>Fotók</title>
    <meta name="description" content="Fotók" />
</svelte:head>

<Page>
    <div>
        <Heading>Katalógus</Heading>
        <Separator />
    </div>
    {#if data.albums}
        <Error condition={download_failed}>Album letöltése sikertelen</Error>
        <div class="c-cards grid gap-8 py-[2rem]">
            {#each data.albums as album}
                <Album
                    {album}
                    on:download_failed={() => (download_failed = true)}
                />
            {/each}
        </div>
    {/if}
</Page>

<style>
    .c-cards {
        grid-template-columns: repeat(5, 1fr);
    }

    @media (max-width: 1900px) {
        .c-cards {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 1600px) {
        .c-cards {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (max-width: 1024px) {
        .c-cards {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 768px) {
        .c-cards {
            grid-template-columns: 1fr;
        }
    }
</style>
