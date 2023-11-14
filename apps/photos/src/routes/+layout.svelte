<script>
    import Header from '../lib/component/Header.svelte';
    import '@fontsource/roboto';
    import '@fontsource/roboto/300.css';
    import '@fontsource-variable/caveat';
    import './styles.css';
    import Notification from '$lib/component/Notification.svelte';

    export let data;
    const { session } = data;
</script>

<div class="app flex flex-col min-h-screen font-caveat text-dark">
    <Header {session} />
    <Notification />
    <main class="contents">
        <slot />
    </main>
    <footer class="mt-auto flex gap-[3rem] p-[0.5rem] text-[1.5rem]">
        <a class="ml-auto hover:text-theme-green transition-colors" href="/">
            burján balázs: fotók
        </a>
        <a class="mr-auto hover:text-theme-green transition-colors" href="info">
            információ
        </a>
    </footer>
</div>
