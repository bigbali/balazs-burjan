<script>
    import Header from '../lib/component/Header.svelte';
    import '@fontsource-variable/raleway';
    import './styles.css';

    export let data;
    const { session } = data;
</script>

<div class="app flex flex-col min-h-screen">
    <Header {session} />
    <main class="contents">
        <slot />
    </main>
    <footer>
        <p>
            visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
        </p>
    </footer>
</div>

<style>
    :global(body) {
        font-family: 'Raleway Variable', sans-serif;
    }
</style>
