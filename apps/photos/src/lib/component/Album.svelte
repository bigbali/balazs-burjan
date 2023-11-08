<script lang="ts">
    import type { Album } from '$lib/type';
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';
    export let album: Album;

    export let is_admin = false;

    $: href_prefix = is_admin ? 'admin/edit/' : 'album/';
    $: href = `${href_prefix}${album.slug}`;

    const dispatch = createEventDispatcher();
    const download_failed = () => dispatch('download_failed');
</script>

{#if !album.hidden || is_admin}
    <div
        class="c-card relative rounded-[1rem] border border-dark/20 hover:scale-[1.05] transition-transform"
    >
        <a {href}>
            <div
                class="absolute z-10 flex flex-col items-center gap-2 rounded-t-[1rem] text-light text-[2rem] text-center bg-dark/80 px-4 py-2 top-0 left-0 right-0"
            >
                <p>
                    {album.title}
                </p>
                {#if album.date}
                    <hr class="text-light/25 w-3/4" />
                    <p>
                        {album.date.toLocaleDateString()}
                    </p>
                {/if}
            </div>
            {#if album.thumbnail}
                <img
                    class="rounded-[1rem] w-full h-full object-cover aspect-square"
                    src={album.thumbnail?.path}
                    alt={album.title}
                />
            {:else}
                <p
                    class="w-full h-full grid place-items-center text-[2rem] p-[2rem] aspect-square"
                >
                    Borító nem található
                </p>
            {/if}
            {#if !is_admin}
                <p
                    class="absolute bottom-[4.375rem] lg:bottom-[5.125rem] left-[1rem] p-[0.5rem] rounded-[0.5rem] justify-self-end bg-dark/80 text-light text-[1.25rem]"
                >
                    {album.images.length} kép
                </p>
            {:else}
                <p
                    class="absolute bottom-[1rem] left-[1rem] p-[0.5rem] rounded-[0.5rem] justify-self-end bg-dark/80 text-light text-[1.25rem]"
                >
                    {album.images.length} kép
                </p>
            {/if}
        </a>
        {#if !is_admin && album.archive}
            <div class="absolute left-0 right-0 bottom-0 flex justify-stretch">
                <Button
                    class="flex-1 open border-r-[1px]"
                    href={`/album/${album.slug}`}
                >
                    Megnyitás
                </Button>
                <Button
                    class="flex-1 download border-l-0"
                    href={album?.archive}
                    download
                    downloadName={album.title}
                    {download_failed}
                >
                    Letöltés
                </Button>
            </div>
        {:else if !is_admin}
            <Button
                class="absolute left-0 right-0 bottom-0 open"
                href={`/album/${album.slug}`}>Megnyitás</Button
            >
        {/if}
    </div>
{/if}

<style>
    .c-card :global(.open) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }

    .c-card :global(.open:has(+ .download)) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 0;
    }

    .c-card :global(.download) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 1rem;
    }
</style>
