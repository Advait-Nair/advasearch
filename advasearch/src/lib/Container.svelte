<script>
	export let extraPadding = false;
	export let omnizindex = false;
	export let minfh = false;
</script>

<div class:extraPadding class:omnizindex class:minfh class="container">
	<slot></slot>
</div>

<!-- Container w/ max-width 1200px and 2rem padding -->

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	/* .minfh {
		min-height: 100svh;
	} */
	.extraPadding {
		padding: 0 3rem;
	}

	@media screen and (max-width: 400px) {
		.extraPadding {
			padding: 0 2rem;
		}
	}

	.omnizindex {
		position: fixed;
		z-index: 10000;
	}
</style>
