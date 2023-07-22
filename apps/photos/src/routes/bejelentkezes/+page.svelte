<script>
    import { page } from "$app/stores";
</script>

<svelte:head>
    <title>
        Fotók
    </title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-12 justify-evenly items-center m-auto">
    <h1 class="text-theme-light-text text-[5rem] text-center leading-[6rem]">
        burján balázs:
        <div class="text-[7rem] font-thin">
            fotók
        </div>
    </h1>
    <a 
        href="/auth/signin/"
        data-sveltekit-preload-data="off"
        class="text-[2rem] font-medium px-10 py-4 border rounded-full text-white bg-green-700 hover:bg-green-800 transition-colors" 
    >
        Bejelentkezés
    </a>
</section>

<style>
    @import '@fontsource-variable/caveat';

    h1 {
        font-family: 'Caveat Variable', cursive;
        font-style: italic;
    }
</style>
