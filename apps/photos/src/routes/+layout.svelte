<script>
    import Header from '../lib/component/Header.svelte';
    import '@fontsource/roboto';
    import '@fontsource/roboto/300.css';
    import '@fontsource-variable/caveat';
    import './styles.css';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { prevPageStore } from '$lib/loginfix';

    onMount(() => {
        if (browser) {
            // reset prev page on every reload (after it has been used, of course)
            prevPageStore.set('');
        }
    });

    export let data;
    const { session } = data;
</script>

<div class="app flex flex-col min-h-screen font-caveat text-dark">
    <!-- ??? type error ??? -->
    <Header {session} />
    <main class="contents">
        <slot />
    </main>
    <footer class="mt-auto flex p-[0.5rem]">
        <p class="mx-auto text-[1.5rem]"> burján balázs: fotók </p>
    </footer>
</div>
