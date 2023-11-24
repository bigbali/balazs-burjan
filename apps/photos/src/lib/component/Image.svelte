<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';
    import type { Image } from '$lib/type';

    export let image: Image;

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click');
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
    <div
        on:click={click}
        on:keydown={click}
        role="button"
        tabindex="0"
        class="w-full h-full"
    >
        {#if image.source}
            <img
                class="rounded-[1rem] w-full h-full object-cover aspect-square"
                src={image.source}
                alt={image.title ?? 'Kép'}
                loading="lazy"
            />
        {:else}
            <p
                class="w-full h-full grid place-items-center text-[2rem] p-[2rem] aspect-square"
            >
                Kép nem található
            </p>
        {/if}
    </div>
    <div class="absolute left-0 right-0 bottom-0 flex justify-stretch">
        <Button
            name="Nagyítás"
            class="c-enlarge flex-1 border-r-[1px]"
            on:click={click}
        >
            Nagyítás
        </Button>
        <Button
            name="Letöltés"
            class="c-download flex-1 border-l-0"
            href={image.source}
            download
            downloadName={image.title}
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
