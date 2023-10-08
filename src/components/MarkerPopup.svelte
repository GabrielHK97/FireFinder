<script lang="ts">
	import { newLocation } from '../writables/newLocation.writable';
	export let marker: any;
</script>

<div class="flex flex-col justify-center items-center space-y-2">
	<div>Set new location?</div>
	<div class="flex flex-row space-x-2 w-full justify-center items-center">
		<button
			class=" bg-black text-white rounded w-full"
			on:click={() => {
				$newLocation = true;
				marker.closePopup();
			}}>Yes</button
		>
		<button
			class=" bg-black text-white rounded w-full"
			on:click={() => {
				$newLocation = false;
				marker.closePopup();
			}}>No</button
		>
	</div>
</div>
