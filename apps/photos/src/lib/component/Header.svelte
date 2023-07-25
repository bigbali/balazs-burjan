<script lang="ts">
    import type { Session } from '@auth/core/types';
    import { signOut } from '@auth/sveltekit/client';

    export let session: Session | null;
</script>

<header>
    <nav class="flex">
        {#if session}
            <button
                class="text-[1.5rem] p-2 bg-theme-red ml-auto text-white"
                on:click={() => signOut()}
            >
                Kijelentkezés
            </button>
        {/if}
    </nav>
</header>
