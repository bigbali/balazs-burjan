<script lang="ts">
    import Heading from '$lib/component/Heading.svelte';
    import Image from '$lib/component/Image.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';

    export let data;
</script>

<Page>
    {#if !data.album}
        <Heading>Ez az album nem található.</Heading>
    {:else}
        <Heading>
            {data.album?.title}
        </Heading>
        <Separator />
        <div class="c-cards grid gap-[2rem]">
            {#each data.album.images as image}
                <Image {image} />
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
