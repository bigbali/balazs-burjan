<script>
    import Header from '../lib/component/Header.svelte';
    import '@fontsource-variable/raleway';
    import '@fontsource-variable/caveat';
    import './styles.css';

    export let data;
    const { session } = data;
</script>

<div class="app flex flex-col min-h-screen font-caveat text-dark">
    <Header {session} />
    <main class="contents">
        <slot />
    </main>
    <footer class="mt-auto">
        <p>
            visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
        </p>
    </footer>
</div>
