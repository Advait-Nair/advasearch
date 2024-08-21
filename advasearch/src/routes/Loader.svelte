<script lang="ts">
	import 'style.main';
	import { getVersion } from 'fn';
	import { writable } from 'svelte/store';

	export let done = writable(false);

</script>

<div class="flex center-flex flex-col splash-container" class:out={$done}>
	<img src="/three_strike.png" alt="Three Strike" />
	<div class="bottom-info flex flex-col center-flex">
		<p class="version">{getVersion()}</p>
		<p class="copyright">Copyright Adva Group, Advait Nair © 2024</p>
	</div>
</div>



<style lang="scss">
	.splash-container {
		animation: flyIn 200ms ease-in-out 300ms forwards;
		opacity: 0;

		width: 100svw;
		height: 100svh;

		img {
			max-width: 40%;
			width: 13rem;
		}

		.bottom-info {
			position: absolute;
			bottom: 0;
			padding: 3rem;
			gap: 3rem;
		}
	}

	.out {
		animation: scaleOut 300ms ease-in-out forwards;
	
	}

	@keyframes scaleOut {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(2);
			// filter: blur(10px);
			// --webkit-filter: blur(10px);
		}
	}

	@keyframes flyIn {
		0% {
			opacity: 0;
			transform: translateY(200px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
