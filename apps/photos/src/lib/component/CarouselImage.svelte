<script lang="ts">
    import type { Image } from '$lib/type';
    import Button from './Button.svelte';

    export let image: Image;
    export let loaded = false;
</script>

<div class="flex justify-center relative rounded-[1rem] max-w-full max-h-full">
    {#if image.title}
        <div
            class="absolute z-10 flex flex-col gap-2 rounded-t-[1rem] text-light text-[2rem] text-center bg-dark/80 px-4 py-2 top-0 left-0 right-0"
        >
            <p>
                {image.title}
            </p>
        </div>
    {/if}
    {#if !loaded}
        <p
            class="w-full h-full grid place-items-center text-[2rem] p-[2rem] border border-dark/20"
        >
            Kép betöltése...
        </p>
    {:else if image.path}
        <img
            class="rounded-[1rem] max-w-full max-h-full object-cover border border-dark/20"
            draggable="false"
            src={image.path}
            alt={image.title ?? 'Kinagyított kép'}
        />
    {:else}
        <p
            class="w-full h-full grid place-items-center text-[2rem] p-[2rem] border border-dark/20"
        >
            Kép nem található
        </p>
    {/if}
    <div class="absolute hidden sm:block sm:right-[1rem] sm:bottom-[1rem]">
        <Button
            name="Letöltés"
            href={image.path}
            download
            downloadName={image.title}
            target="_self"
        >
            Letöltés
        </Button>
    </div>
</div>
