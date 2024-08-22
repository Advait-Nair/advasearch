

<script lang="ts">
    import Container from 'c/Container.svelte';
    import { getTime, getDate } from 'fn';
    import 'style.main';

    let displaySeconds = false;

    let currentTime: string = getTime(displaySeconds);
	let currentDate: string = getDate();

    import { onMount, onDestroy } from 'svelte';


    // function timeUpdate() {
    //     const date = new Date();
    //     time = date.getHours().padStart('0',2) + ':' + date.getMinutes().padStart('0',2);
    // }


    let clockInterval: any | null = null;
    onMount(() => {
		clockInterval = setInterval(() => {
			currentTime = getTime(displaySeconds);
			currentDate = getDate();
		}, 1000);

		// if ($dashMode) timeUpdateInterval = setInterval(timeupdater, 1000);
	});

    onDestroy(() => {
        clearInterval(clockInterval);
    });


</script>

<div class="floater blur dark">
    <!-- <Container> -->
        <div class="status-bar flex space-between">
            <div class="flex left-flex left-align flex-col">
                <img draggable="false" src="/three_strike_white.png" alt="logo" class="logo scaled-logo" />
            </div>
            <div class="time flex right-flex right-align flex-col">
                <div class="currentTime">{currentTime}</div>
                <div class="currentDate">{currentDate}</div>
            </div>
        </div>
    <!-- </Container> -->
</div>
<div class="ghost-padder"></div>


<style lang="scss">

	.ghost-padder {
		height: 5.7rem;
	}

	.floater {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;

		pointer-events: none;
	}

	.blur {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		background: #00000033;
	}
	.light {
		background: #00000010;
	}
	.dark {
		background: #0000007c;
	}

	.status-bar {
		padding: 1.5rem 2.5rem;
		// padding-bottom: 1rem;
		justify-content: space-between;
		user-select: none;
		font-size: 1.2rem;
		font-weight: 600;

		.time,
		.journey {
			gap: 0.3rem;
		}

		.journey,
		.time {
			max-width: 7rem;
			width: 7rem;
		}

		.currentDate {
			opacity: 0.6;
		}
		.currentDate,
		.currentTime {
			text-align: right;
		}

		.elapsedTime {
			color: #ff6f6f;
		}
	}
</style>
