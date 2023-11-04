<script lang="ts">
    export let level = 1;
    export let style: string | undefined = undefined;
</script>

{#if level === 1}
    <h1 class="text-[2rem] lg:text-[3rem] text-center text-dark" {style}>
        <slot />
    </h1>
{:else if level === 2}
    <h2 class="text-[1.75rem] lg:text-[2.5rem] text-center text-dark" {style}>
        <slot />
    </h2>
{:else if level === 3}
    <h3 class="text-[1.25rem] lg:text-[2rem] text-center text-dark" {style}>
        <slot />
    </h3>
{/if}
