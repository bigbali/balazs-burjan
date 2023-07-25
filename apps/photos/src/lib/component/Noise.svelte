<script lang="ts">
    import { browser } from '$app/environment';

    export let className = '';
    export let type = 'turbulence';
    export let stitch = 'stitch';
    export let frequency = 0.65;
    export let octaves = 3;
    export let width = browser ? window.innerWidth : 1000;
    export let height = browser ? window.innerHeight : 1000;
</script>

{#if browser}
    <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        class={className}
        preserveAspectRatio="none"
    >
        <filter id="noiseFilter">
            <feTurbulence
                {type}
                baseFrequency={frequency}
                numOctaves={octaves}
                stitchTiles={stitch}
            />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
{/if}

<style>
    svg {
        filter: grayscale(1);
    }
</style>
