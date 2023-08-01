<script lang="ts">
    import { CldImage } from 'svelte-cloudinary';
    import data2 from '$lib/asset/data';

    export let data;

    // $: console.log(data.albums.folders);
</script>

<svelte:head>
    <title>Fotók</title>
    <meta name="description" content="Fotók" />
</svelte:head>

<section class="px-[8rem]">
    <div class="flex justify-center">
        <h1
            class="text-dark text-[6rem] text-center leading-[6rem] my-[5rem] w-fit italic"
        >
            katalógus
            <hr class="border-[0.2rem] text-dark" />
        </h1>
    </div>
    {#if data.albums}
        <div class="grid grid-flow-col auto-cols-max gap-8">
            {#each data.albums as album}
                <a href={`/album/${album.slug}`}>
                    <div
                        class="relative bg-theme-green border border-theme-red"
                    >
                        <p
                            class="absolute z-10 text-light text-[1.5rem] text-center bg-dark/50 p-4 top-0 left-0 right-0"
                        >
                            {album.title}
                        </p>
                        <img src={album.thumbnail?.path} alt={album.title} />
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</section>

<style>
    @import '@fontsource-variable/caveat';

    h1,
    p {
        font-family: 'Caveat Variable', cursive;
    }
</style>
