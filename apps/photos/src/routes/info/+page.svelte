<script lang="ts">
    import Heading from '$lib/component/Heading.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';
</script>

<svelte:head>
    <title>Infó</title>
    <meta name="description" content="Információ erről az applikációról" />
</svelte:head>

<Page style="margin: auto">
    <Heading>Erről az applikációról</Heading>
    <Separator style="width: 35%; min-width: 15rem; margin-inline: auto" />
    <div class="text-[1.75rem] lg:px-[20vw] lg:pt-[2rem]">
        <p>
            Ezen applikáció célja a fotóim nyilvánosságra tétele ismerőseim
            számára.
        </p>
        <p>
            A fotók albumokra bontva érhetők el, és a képeket le lehet tölteni
            de csak egyenként mivel a szolgáltató, ahol a fotók tárolva vannak,
            nem teszi lehetőve az albumonkénti letöltést.
        </p>
    </div>
</Page>
