<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
    import Noise from '$lib/component/Noise.svelte';
    import Error from '$lib/component/Error.svelte';
    import { writable } from 'svelte/store';

    let show = writable(false);
    let password = writable('');
    let auth_result = writable<Response | null | undefined>();

    const handleSignIn = async () => {
        try {
            $auth_result = await signIn('credentials', {
                password: $password,
                redirect: false
            });

            if ($auth_result?.ok) {
                location.reload();
            }
        } catch {
            $auth_result = null;
        }
    };
</script>

<svelte:head>
    <title>Fotók</title>
    <meta name="description" content="Fotók | bejelentkezés" />
</svelte:head>

<section class="flex flex-1">
    {#if $auth_result === null}
        <Error
            className="text-[1.5rem] font-medium text-light"
            condition
            message="bejelentkezés sikertelen"
        />
    {/if}
    <Noise
        className="absolute -z-10 inset-0 opacity-50"
        frequency={0.3}
        octaves={10}
    />
    <div id="rect" class="relative m-auto bg-dark text-light rounded-[3rem]">
        <Noise
            className="absolute inset-0 z-0 h-full w-full opacity-50 invert rounded-[3rem]"
            frequency={0.3}
            octaves={10}
            width={1000}
            height={1000}
        />
        <div
            class="relative z-10 flex flex-col gap-28 items-center w-full h-full px-96 py-16 pb-24"
        >
            <h1 class="text-[5rem] text-center leading-[6rem] italic">
                burján balázs:
                <div class="text-[7rem] font-thin">fotók</div>
            </h1>
            <div class="flex flex-col gap-12">
                <div class="flex flex-col gap-4">
                    <div class="w-full">
                        <label
                            class="flex flex-col gap-2 text-[2rem] leading-[3rem] pl-2"
                            for="password"
                        >
                            jelszó:
                        </label>
                        <input
                            class="cursor-text border-2 rounded-[0.5rem] border-light/50 bg-light text-dark py-1 px-2 text-[1.5rem] leading-[2rem] w-full"
                            id="password"
                            name="password"
                            type={$show ? 'text' : 'password'}
                            value={$password}
                            placeholder="jelszó"
                            on:input={(e) =>
                                ($password = e.currentTarget.value)}
                        />
                    </div>
                    <label
                        class="flex gap-2 items-center text-[2rem] leading-[2rem]"
                    >
                        <input
                            class="w-[2rem] h-[2rem] border-[3px] rounded-[1rem] accent-theme-green"
                            type="checkbox"
                            checked={$show}
                            on:change={(e) => {
                                $show = e.currentTarget.checked;
                            }}
                        />
                        <span> jelszó megjelenítése </span>
                    </label>
                </div>
                <button
                    class="text-[3rem] font-medium rounded-full leading-12 px-8 w-full bg-theme-green tracking-wide border-[3px] border-light/50"
                    on:click={handleSignIn}
                >
                    bejelentkezés
                </button>
            </div>
        </div>
    </div>
</section>

<style>
    @import '@fontsource-variable/caveat';

    h1,
    label,
    button {
        font-family: 'Caveat Variable', cursive;
    }

    label,
    input[type='checkbox'] {
        cursor: pointer;
    }

    label {
        user-select: none;
    }

    #password {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
</style>
