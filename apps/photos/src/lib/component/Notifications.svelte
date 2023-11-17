<script lang="ts">
    import { notifications } from '$lib/client/notification';
    import autoAnimate from '@formkit/auto-animate';
    import Notification from './Notification.svelte';
</script>

<ul
    class="c-notifications fixed inset-0 top-[10%] px-[10vw] pointer-events-none"
    use:autoAnimate
>
    {#each $notifications as notification}
        <Notification {notification} />
    {/each}
</ul>

<style>
    .c-notifications {
        z-index: 1000;
    }
</style>
