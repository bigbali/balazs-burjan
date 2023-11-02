<script lang="ts">
    import Album from '$lib/component/Album.svelte';
    import Heading from '$lib/component/Heading.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';

    export let data;
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
        <div class="c-cards grid gap-8 py-[2rem]">
            {#each data.albums as album}
                <Album {album} />
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
