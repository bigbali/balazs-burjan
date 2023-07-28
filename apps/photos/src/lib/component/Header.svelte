<script lang="ts">
    import type { Session } from '@auth/core/types';
    import { signOut } from '@auth/sveltekit/client';

    export let session: Session | null;
</script>

<header
    class="flex justify-between items-center p-3 px-6 border-b border-b-dark/25 bg-light/25 backdrop-blur-[3rem]"
>
    <a href="/" class="text-[2.5rem] text-dark leading-none"> Fotók </a>
    <nav class="flex">
        {#if session}
            <button
                class="text-[2rem] p-2 px-6 ml-auto text-white rounded-full text-dark border border-theme-red leading-none"
                on:click={() => signOut()}
            >
                Kijelentkezés
            </button>
        {/if}
    </nav>
</header>

<style>
    @import '@fontsource-variable/caveat';

    header {
        font-family: 'Caveat Variable', cursive;
    }
</style>
