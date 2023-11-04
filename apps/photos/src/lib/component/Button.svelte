<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let href: string | undefined = undefined;
    export let target: string | undefined = undefined;
    export let type: 'button' | 'submit' | 'reset' | null | undefined =
        undefined;
    export let download: string | boolean | undefined = undefined;
    export let downloadName: string | null | undefined = 'névtelen';

    /**
     * A callback for when the download fails for whatever reason
     */
    export let download_failed: (() => void) | undefined = undefined;

    export let name: string | undefined = undefined;

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
        large: ' text-[1.5rem] lg:text-[2.5rem] py-3 px-8',
        medium: ' text-[1.5rem] lg:text-[2rem] py-2 px-6',
        small: ' text-[1rem] lg:text-[1rem] py-1 px-4'
    } as const;

    const activeMap = {
        green: ' bg-theme-green text-light',
        red: ' bg-theme-red text-light',
        default: ' bg-darktext-light'
    } as const;

    const _class = (className && ` ${className}`) || '';
    const _color = colorMap[color];
    const _size = sizeMap[size];
    const _active = (active && activeMap[color]) || '';

    const downloadFile = async () => {
        if (!href) return;
        try {
            const response = await fetch(href);

            if (!response.ok) {
                download_failed && download_failed();
                return;
            }

            const contentType = response.headers.get('content-type');

            let extension = '.zip';

            if (contentType) {
                if (contentType.includes('image/png')) extension = '.png';
                else if (contentType.includes('image/jpeg'))
                    extension = '.jpeg';
                else if (contentType.includes('image/jpg')) extension = '.jpg';
                else if (contentType.includes('image/gif')) extension = '.gif';
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = (downloadName ?? 'névtelen') + extension;
            a.click();
        } catch (error) {
            console.error('Kép letöltése sikertelen:', error);
        }
    };

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click');
</script>

{#if href}
    <a
        class={`text-center rounded-full border transition-colors${_color}${_size}${_active}${_class}`}
        {href}
        {download}
        {target}
        on:click={(e) => {
            if (download) {
                e.preventDefault();
                downloadFile();
            }
            click();
        }}
    >
        <slot />
    </a>
{:else}
    <button
        class={`text-center rounded-full border transition-colors ${_color}${_size}${_active}${_class}`}
        {type}
        {name}
        on:click={click}
    >
        <slot />
    </button>
{/if}
