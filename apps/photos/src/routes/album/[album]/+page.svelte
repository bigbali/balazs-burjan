<script lang="ts">
    export let data;
</script>

<section class="flex flex-col items-center">
    <h1
        class="text-dark text-[3rem] text-center my-[5rem] w-fit italic border-b-[3px] leading-tight"
    >
        {data.album?.title}
    </h1>
    {#if data.album}
        {#each data.album.images as image}
            <div>
                <img src={image.path} alt="" class="h-32 w-32" />
            </div>
        {/each}
    {/if}
</section>
