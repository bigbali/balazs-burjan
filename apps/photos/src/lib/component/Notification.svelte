<script lang="ts">
    import type { NotificationMeta } from '$lib/client/notification';

    export let notification: NotificationMeta;

    let focused = false;

    notification.extend(() => {
        if (focused) return 1000;
    });

    const color = {
        info: ' bg-theme-green',
        warn: ' bg-[rgb(200, 100, 100)]',
        error: ' bg-theme-red'
    } as const;
</script>

<li
    class={`c-notification relative mx-auto mb-[1rem] p-[1rem] w-fit h-fit min-w-[40rem] min-h-[10rem] rounded-[1rem] border border-light/25${
        color[notification.type]
    }`}
    on:mouseenter={() => (focused = true)}
    on:focus={() => (focused = true)}
    on:mouseleave={() => (focused = false)}
    on:focusout={() => (focused = false)}
>
    <button
        class="absolute top-1 right-1 grid place-items-center text-[1.5rem] leading-[1.5rem] h-[1.5rem] w-[1.5rem] font-bold text-light"
        on:click={() => {
            focused = false;
            notification.cancel();
        }}
    >
        x
    </button>
    <div class="flex flex-col gap-[1rem] font-roboto">
        {#if notification.title}
            <p class="text-[1.5rem] px-[1rem] text-light">
                {notification.title}
            </p>
        {/if}
        {#if notification.message}
            <p class="text-light px-[1rem]">
                {notification.message}
            </p>
        {/if}
    </div>
</li>

<style>
    .c-notification {
        pointer-events: all;
    }

    button {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
</style>
