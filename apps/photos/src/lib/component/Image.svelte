<script lang="ts">
    import type { Image } from '$lib/type';
    import Button from './Button.svelte';

    export let image: Image;
</script>

<div
    class="c-card relative rounded-[1rem] border border-dark/20 hover:scale-[1.05] transition-transform"
>
    {#if image.title}
        <div
            class="absolute z-10 flex flex-col gap-2 rounded-t-[1rem] text-light text-[2rem] text-center bg-dark/80 px-4 py-2 top-0 left-0 right-0"
        >
            <p>
                {image.title}
            </p>
        </div>
    {/if}
    {#if image.path}
        <img
            class="rounded-[1rem] w-full h-full object-cover aspect-square"
            src={image.path}
            alt={image.title}
        />
    {:else}
        <p
            class="w-full h-full grid place-items-center text-[2rem] p-[2rem] aspect-square"
        >
            Borító nem található
        </p>
    {/if}
    <div class="absolute left-0 right-0 bottom-0 flex justify-stretch">
        <Button class="c-enlarge flex-1 border-r-[1px]">Nagyítás</Button>
        <Button
            class="c-download flex-1 border-l-0"
            href={image.path}
            download
            target="_blank"
        >
            Letöltés
        </Button>
    </div>
</div>

<style>
    .c-card :global(.c-enlarge) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 0;
    }

    .c-card :global(.c-download) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 1rem;
    }
</style>
