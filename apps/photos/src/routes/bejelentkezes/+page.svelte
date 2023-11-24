<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
    import Noise from '$lib/component/Noise.svelte';
    import Button from '$lib/component/Button.svelte';
    import Heading from '$lib/component/Heading.svelte';
    import { notify } from '$lib/client/notification';

    let show = false;
    let password: string | undefined;

    let auth_result: Response | null | undefined = undefined;

    $: handleSignIn = async (e: Event) => {
        e.preventDefault();

        auth_result = await signIn('credentials', {
            password: password,
            redirect: false
        });

        if (auth_result?.ok) {
            location.reload();
        } else {
            notify({
                type: 'error',
                message: 'Bejelentkezés sikertelen: hibás jelszó.',
                timeout: 300000
            });
        }
    };
</script>

<svelte:head>
    <title>Fotók</title>
    <meta name="description" content="Fotók | bejelentkezés" />
</svelte:head>

<section class="flex flex-1">
    <Noise
        className="absolute -z-10 inset-0 opacity-50"
        frequency={0.3}
        octaves={10}
    />
    <div
        id="rect"
        class="relative m-auto bg-[transparent] text-dark rounded-[2rem] px-[2rem] lg:px-0"
    >
        <div
            class="relative z-10 flex flex-col gap-28 items-center w-full h-full lg:px-96 lg:py-16 lg:pb-24"
        >
            <Heading style="line-height: 5rem">
                <div class="text-[3rem] lg:text-[5rem]"> burján balázs: </div>
                <div class="text-[5rem] lg:text-[7rem] font-thin">fotók</div>
            </Heading>
            <form class="flex flex-col gap-12" on:submit={handleSignIn}>
                <div class="flex flex-col gap-4">
                    <div class="w-full">
                        <label
                            class="flex flex-col gap-2 text-[2rem] leading-[3rem] pl-2"
                            for="password"
                        >
                            jelszó:
                        </label>
                        <input
                            class="cursor-text border rounded-[0.5rem] border-dark bg-light text-dark py-1 px-2 text-[1.5rem] leading-[2rem] w-full font-caveat"
                            id="password"
                            name="password"
                            type={show ? 'text' : 'password'}
                            value={password ?? null}
                            placeholder="jelszó"
                            on:input={(e) => (password = e.currentTarget.value)}
                        />
                    </div>
                    <label
                        class="flex gap-2 items-center text-[2rem] leading-[2rem]"
                    >
                        <input
                            class="w-[2rem] h-[2rem] border-[3px] rounded-[1rem] accent-theme-green"
                            type="checkbox"
                            checked={show}
                            on:change={(e) => {
                                show = e.currentTarget.checked;
                            }}
                        />
                        <span> jelszó megjelenítése </span>
                    </label>
                </div>
                <Button
                    type="submit"
                    size="large"
                    color="green"
                    class="text-[2rem] lg:text-[3rem]"
                >
                    Bejelentkezés
                </Button>
            </form>
        </div>
    </div>
</section>

<style>
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
