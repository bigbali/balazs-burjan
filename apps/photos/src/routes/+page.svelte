<script lang="ts">
    import { CldImage } from 'svelte-cloudinary';
    import data2 from '$lib/asset/data';

    export let data;

    // $: console.log(data.albums.folders);
</script>

<svelte:head>
    <title>Fotók</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-12 justify-evenly items-center m-auto">
    <h1 class="text-dark text-[6rem] text-center leading-[6rem]">
        katalógus
        <hr class="border-[0.2rem] text-dark" />
    </h1>
    {#if data.albums}
        <div class="grid grid-flow-col auto-cols-max gap-8">
            {#each data.albums.folders as album}
                <!-- <CldImage
                    width={960}
                    height={600}
                    src="samples"
                    alt="Description of my image"
                    sizes="100vw"
                /> -->
                <a href={`/album/${album.path}`}>
                    <div
                        class="w-[10rem] h-[10rem] bg-theme-green border border-theme-red"
                    >
                        <p>
                            {album.name}
                        </p>
                        <p>
                            {album.description}
                        </p>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</section>

<style>
    @import '@fontsource-variable/caveat';

    h1 {
        font-family: 'Caveat Variable', cursive;
        font-style: italic;
    }
</style>
