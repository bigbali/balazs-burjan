<script lang="ts">
    import { fade, fly } from 'svelte/transition';

    export let className = '';
    export let condition = false;
    export let onClose: (() => void) | null = null;
    $: open = condition;
    $: !open && onClose && onClose();
</script>

{#if open}
    <div
        class={`fixed p-8 z-50 bg-theme-red text-light inset-0 m-auto mt-[15rem] w-fit h-fit rounded-[1rem] border border-light/25${
            (className && ' ') || ''
        }${className}`}
        in:fly={{
            delay: 200,
            duration: 300,
            x: 0,
            y: -160
        }}
        out:fade={{
            duration: 100
        }}
    >
        <button
            class="absolute top-1 right-1 grid place-items-center text-[1.5rem] leading-[1.5rem] h-[1.5rem] w-[1.5rem] font-bold"
            on:click={() => {
                open = false;
            }}
        >
            x
        </button>
        <p class="font-roboto">
            <slot />
        </p>
    </div>
{/if}

<style>
    button {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
</style>
