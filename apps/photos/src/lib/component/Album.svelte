<script lang="ts">
    import type { AlbumWithThumbnail } from '$lib/type';
    import Button from './Button.svelte';
    export let album: AlbumWithThumbnail;
</script>

<div class="c-container relative rounded-[1rem]">
    <a href={`/album/${album.slug}`}>
        <div
            class="absolute z-10 flex flex-col gap-2 rounded-t-[1rem] text-light text-[2rem] text-center bg-dark/80 px-4 py-2 top-0 left-0 right-0"
        >
            <p>
                {album.title}
            </p>
            <hr />
            <p>
                {album.date || '-'}
            </p>
        </div>
        <img
            class="rounded-[1rem] w-full h-full object-cover aspect-square"
            src={album.thumbnail?.path}
            alt={album.title}
        />
    </a>
    {#if album.archive}
        <div class="absolute left-0 right-0 bottom-0 flex justify-stretch">
            <Button
                class="flex-1 open border-r-[1px]"
                href={`/album/${album.slug}`}
            >
                Megnyitás
            </Button>
            <Button
                class="flex-1 download border-l-0"
                href="{album?.archive}}"
                download
                target="_blank"
            >
                Letöltés
            </Button>
        </div>
    {:else}
        <Button
            class="absolute left-0 right-0 bottom-0 open"
            href={`/album/${album.slug}`}>Megnyitás</Button
        >
    {/if}
</div>

<style>
    .c-container :global(.open) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }

    .c-container :global(.open:has(+ .download)) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 0;
    }

    .c-container :global(.download) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 1rem;
    }

    .c-container > a > img {
        transition: filter 0.2s;
    }

    .c-container:hover > a > img {
        filter: brightness(0.75);
    }
</style>
