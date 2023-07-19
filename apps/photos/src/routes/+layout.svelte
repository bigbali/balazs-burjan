<script>
    import Header from './Header.svelte';
      import { page } from "$app/stores"

    import '@fontsource-variable/raleway';
    import './styles.css';
</script>

<div class="app flex flex-col min-h-screen">
    <Header />
    <main class="contents">
        <slot />
    </main>
    <footer class="mt-auto">
        <p>
            visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
        </p>
     </footer>
</div>

<style>
    :global(body) {
        font-family:  'Raleway Variable', sans-serif;
    }
</style>