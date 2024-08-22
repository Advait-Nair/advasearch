<script lang="ts">
    let noImages = 29;
    let currentURI = getRandomImageURI();
    let lastURI = currentURI;
    let appear = true;

    let lastRandom:number;
    function getRandomImageURI():string {
        let random = Math.floor(Math.random() * noImages)
        while (lastRandom == random) {
            random = Math.floor(Math.random() * noImages)
        }
        return '/images/photo_' + random + '.jpg';
    }

    import { onMount, onDestroy } from 'svelte';

    let interval: any | null = null;

    onMount(() => {
        interval = setInterval(() => {
            lastURI = currentURI;
            currentURI = getRandomImageURI();
        }, 5000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

</script>

<div class="background">
    <div class="image-transitioner">
        <img draggable="false" src={lastURI} alt="background" class="background-image" />
    </div>
    {#key currentURI}
    <div class="image-transitioner" class:appear>
        <img draggable="false" src={currentURI} alt="background" class="background-image" />
    </div>
    {/key}
</div>

<style lang="scss">
	.background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        z-index: -1;

        img, .image-transitioner {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-transitioner {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .appear {
            animation: appear 2s ease-in-out forwards;
        }

        @keyframes appear {
            0% {
                opacity: 0;
                transform: scale(1.1);
                filter: blur(10px);
                -webkit-filter: blur(10px);
            }
            100% {
                opacity: 1;
                transform: scale(1);
                -webkit-filter: blur(0);
                filter: blur(0);
            }
        }
    }
</style>
