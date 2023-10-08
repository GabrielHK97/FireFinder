<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import { iconPerson } from '../icons/person.icon';
	import type { MapBound } from '../interfaces/mapBound.interface';
	import axios from 'axios';
	import { parse } from 'csv-parse/sync';
	import { vapidKey } from '../vapid-key';
	import MarkerPopup from './MarkerPopup.svelte';
	import { newLocation } from '../writables/newLocation.writable';

	let map: any;
	let mapElement: any;
	let leaflet: any;
	let mapBound: MapBound;
	let loadedMap: boolean = false;
	let minRadius: number = import.meta.env.VITE_MIN_RADIUS;
	let maxRadius: number = import.meta.env.VITE_MAX_RADIUS;
	let radius: number = minRadius;
	let coords: Array<number>;
	let circle: any;
	let location: any;
	let fires: any;
	let subscription: any;
	let click: any;

	// 1: World
	// 5: Landmass/continent
	// 10: City
	// 15: Streets
	// 20: Buildings

	function bindPopup(marker: any, create: any) {
		let popupComponent: any;
		marker
			.bindPopup(() => {
				let container = leaflet.DomUtil.create('div');
				popupComponent = create(container);
				return container;
			})
			.openPopup();

		marker.on('popupclose', () => {
			if (popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				setTimeout(() => {
					old.$destroy();
				}, 500);
			}
		});
	}

	function setLocatiionAndRadius(): void {
		if (leaflet) {
			let icon = leaflet.divIcon({
				html: iconPerson,
				className: '',
				iconSize: [22, 22]
			});
			if (location) location.remove();
			location = leaflet.marker(coords, { icon }).addTo(map).bindPopup('You are here!');
			if (circle) circle.remove();
			circle = leaflet
				.circle(coords, {
					color: 'red',
					fillColor: '#f03',
					fillOpacity: 0.2,
					radius: radius * 1000
				})
				.addTo(map);
		}
	}

	function adjustRadius() {
		setLocatiionAndRadius();
		if (map) {
			const zoom = 20 - 7 * radius ** 0.131;
			map.setZoom(zoom);
		}
	}

	async function setFires(mapBound: MapBound): Promise<void> {
		const date = new Date();
		const offset = date.getTimezoneOffset();
		const localDate = new Date(date.getTime() - offset * 60 * 1000);
		const formattedDate = localDate.toISOString().split('T')[0];
		let icon = leaflet.divIcon({
			html: `<div class="text-xl">🔥</div>`,
			className: '',
			iconSize: [22, 22]
		});

		axios.defaults.baseURL = 'https://firms.modaps.eosdis.nasa.gov';
		const response = (
			await axios.get(
				`/api/area/csv/7582abe461432d62b73c44214d87cc3b/MODIS_NRT/${mapBound.west},${mapBound.south},${mapBound.east},${mapBound.north}/1/${formattedDate}` //
			)
		).data;
		fires = parse(response, {
			columns: true,
			skip_empty_lines: true
		});

		fires.forEach((fire: any) => {
			leaflet.marker([fire.latitude, fire.longitude], { icon }).addTo(map);
		});

		sendNotifications();
	}

	function setMapEvents(): void {
		map
			.whenReady(() => {
				loadedMap = true;
				const boundaries = map.getBounds();
				mapBound = {
					west: boundaries._southWest.lng,
					south: boundaries._southWest.lat,
					east: boundaries._northEast.lng,
					north: boundaries._northEast.lat
				};
			})
			.on('click', (e: any) => {
				click = e.latlng;
				const marker = leaflet
					.marker([click.lat, click.lng], {
						icon: leaflet.divIcon({
							html: '<div></div>',
							className: 'default'
						})
					})
					.addTo(map);

				bindPopup(marker, (m: any) => {
					let markerPopup = new MarkerPopup({
						target: m,
						props: {
							marker
						}
					});
				});
			})
			.on('moveend', () => {
				const boundaries = map.getBounds();
				mapBound = {
					west: boundaries._southWest.lng,
					south: boundaries._southWest.lat,
					east: boundaries._northEast.lng,
					north: boundaries._northEast.lat
				};
				setFires(mapBound);
			});
	}

	async function setUpLeafletMap(position: GeolocationPosition): Promise<void> {
		leaflet = await import('leaflet');
		coords = [position.coords.latitude, position.coords.longitude];

		map = leaflet.map(mapElement, { preferCanvas: true }).setView(coords, 12);
		leaflet
			.tileLayer(
				`https://api.mapbox.com/styles/v1/gabrielhk97/clnfboubx07s601qi8p3xcd1z/tiles/256/{z}/{x}/{y}@2x?access_token=${
					import.meta.env.VITE_MAPBOX_TOKEN
				}`,
				{
					maxZoom: 20,
					minZoom: 3,
					attribution: '&copy; <a href="https://www.mapbox.com/legal/tos">Mapbox</a>'
				}
			)
			.addTo(map);

		setLocatiionAndRadius();
		setMapEvents();
	}

	function isInsideNotificationCircle(point: Array<number>): boolean {
		const inMeters = 111.319488 * Math.cos((coords[0] * Math.PI) / 180);
		return ((coords[0] - point[0]) ** 2 + (coords[1] - point[1]) ** 2) ** 0.5 <= radius / inMeters;
	}

	function sendNotifications(): void {
		for (const fire of fires) {
			if (isInsideNotificationCircle([fire.latitude, fire.longitude])) {
				subscription['message'] = 'There is fire near you!';
				axios.defaults.baseURL = import.meta.env.VITE_API_PUSH;
				axios.post('notifications', subscription);
				break;
			}
		}
	}

	onMount(async () => {
		if (browser && navigator) {
			navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition) => {
				await setUpLeafletMap(position);
				await navigator.serviceWorker.register('./worker.js');
				navigator.serviceWorker.ready.then((registration) => {
					Notification.requestPermission()
						.then(() => {
							const options = {
								userVisibleOnly: true,
								applicationServerKey: vapidKey.publicKey
							};
							return registration.pushManager.subscribe(options);
						})
						.then((pushSubscription) => {
							subscription = pushSubscription.toJSON();
						});
				});
			});
		}

		setInterval(() => {
			if (mapBound) setFires(mapBound);
			sendNotifications();
		}, import.meta.env.VITE_TIME_IN_MILLISECONDS);
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});

	$: radius && adjustRadius();
	$: if ($newLocation) {
		coords = [click.lat, click.lng];
		setLocatiionAndRadius();
		setFires(mapBound);
	}
</script>

<div
	class="{loadedMap ? 'hidden' : 'absolute'} w-screen h-screen top-0 left-0"
	style="z-index: 9999"
>
	<div class="w-full h-full flex flex-col justify-center items-center">Loading...</div>
</div>
<div class="w-screen h-screen flex flex-col">
	<div bind:this={mapElement} class="flex-grow w-full" />
	<div class="p-2 flex flex-col space-y-2">
		<div>Radius of notification (Km)</div>
		<div class="flex flex-row space-x-2">
			<div>{minRadius}</div>
			<input type="range" min={minRadius} max={maxRadius} class="w-full" bind:value={radius} />
			<div>{maxRadius}</div>
		</div>
	</div>
</div>
