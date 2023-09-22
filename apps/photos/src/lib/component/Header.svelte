<script lang="ts">
    // import type { Session } from '@auth/sveltekit';
    // import type {Session} from ''
    import { signOut } from '@auth/sveltekit/client';
    import Button from './Button.svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import type { Session } from '@auth/core/types';

    export let session: Session | null;

    $: active = browser && $page.url.pathname === '/admin';
</script>

<header
    class="flex justify-between items-center p-3 px-6 border-b border-b-dark/25 bg-light/25 backdrop-blur-[3rem]"
>
    <a href="/" class="text-[2.5rem] text-dark leading-none"> Fotók </a>
    <nav class="flex gap-[1rem]">
        {#if session}
            {#if session.user.role === 'admin'}
                <Button color="green" href="/admin" {active}>Admin</Button>
            {/if}
            <Button color="red" on:click={() => signOut()}>Kijelentkezés</Button
            >
        {/if}
    </nav>
</header>
