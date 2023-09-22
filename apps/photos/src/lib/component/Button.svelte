<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let href: string | undefined = undefined;
    export let download: boolean | undefined = undefined;
    export let target: string | undefined = undefined;
    export let type: 'button' | 'submit' | 'reset' | null | undefined =
        undefined;

    export let color: 'green' | 'red' | 'default' = 'default';
    export let size: 'large' | 'medium' | 'small' = 'medium';

    export let active: boolean | undefined = false;

    let className = '';
    export { className as class };

    const colorMap = {
        green: ' bg-light text-dark border-theme-green hover:bg-theme-green hover:text-light',
        red: ' bg-light text-dark border-theme-red hover:bg-theme-red hover:text-light',
        default:
            ' bg-light text-dark border-dark hover:bg-dark hover:text-light'
    } as const;

    const sizeMap = {
        large: ' text-[2.5rem] py-3 px-8',
        medium: ' text-[2rem] py-2 px-6',
        small: ' text-[1.5rem] py-1 px-4'
    } as const;

    const activeMap = {
        green: ' bg-theme-green text-light',
        red: ' bg-theme-red text-light',
        default: ' bg-darktext-light'
    } as const;

    $: _class = (className && ` ${className}`) || '';
    $: _color = colorMap[color];
    $: _size = sizeMap[size];
    $: _active = (active && activeMap[color]) || '';

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click');
</script>

{#if href}
    <a
        class={`text-center rounded-full border transition-colors${_color}${_size}${_active}${_class}`}
        {href}
        {download}
        {target}
        on:click={click}
    >
        <slot />
    </a>
{:else}
    <button
        class={`text-center rounded-full border transition-colors ${_color}${_size}${_active}${_class}`}
        {type}
        on:click={click}
    >
        <slot />
    </button>
{/if}
