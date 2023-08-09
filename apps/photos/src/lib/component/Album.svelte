<script lang="ts">
    import type { AlbumWithThumbnail } from '$lib/type';
    export let album: AlbumWithThumbnail;
</script>

<div class="c-container relative rounded-[2rem] border border-theme-red">
    <a href={`/album/${album.slug}`}>
        <div
            class="absolute z-10 rounded-t-[2rem] text-light text-[1.5rem] text-center bg-dark/80 p-4 top-0 left-0 right-0"
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
            class="rounded-[2rem] w-full h-full object-cover aspect-square"
            src={album.thumbnail?.path}
            alt={album.title}
        />
    </a>
    {#if album.archive}
        <div
            class="c-download absolute left-0 bottom-0 right-0 p-4 bg-dark/80 rounded-b-[2rem]"
        >
            <a
                class="h-[4.5rem] flex gap-[1rem] items-center justify-center text-theme-green font-caveat text-[4rem] font-medium"
                href={album?.archive}
                download
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.75"
                    class="h-full stroke-theme-green"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                </svg>
                <p>letöltés</p>
            </a>
        </div>
    {/if}
</div>

<style>
    .c-download {
        opacity: 0;
        transition: opacity 0.2s;
    }
    .c-container:hover .c-download {
        opacity: 1;
    }
</style>
