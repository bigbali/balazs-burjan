<script lang="ts">
    import Heading from '$lib/component/Heading.svelte';
    import Page from '$lib/component/Page.svelte';
</script>

<svelte:head>
    <title>Infó</title>
    <meta name="description" content="Információ erről az applikációról" />
</svelte:head>

<Page>
    <Heading>Erről az applikációról</Heading>
    <div class="text-[1.75rem] lg:px-[20vw] lg:pt-[2rem]">
        <p>
            Ezen applikáció célja a fotóim nyilvánosságra tétele ismerőseim
            számára.
        </p>
        <p>
            A fotók albumokra bontva érhetők el, és a képeket le lehet tölteni
            albumonként, illetve egyenként.
        </p>
        <p>
            Ha egy egész albumot tölt le, az tömörített .zip formátumban fog
            megjelenni.
        </p>
        <p>
            Az egyenként letöltött képek nincsenek tömörítve, ezeket probléma
            nélkül lehet kezelni.
        </p>
    </div>
</Page>
