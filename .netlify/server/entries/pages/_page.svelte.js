import { c as create_ssr_component, a as subscribe, o as onDestroy, b as set_store_value, e as escape, d as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import axios from "axios";
import { parse } from "csv-parse/sync";
import { w as writable } from "../../chunks/index.js";
const leaflet = "";
const app = "";
const newLocation = writable(false);
const LeaftletMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $newLocation, $$unsubscribe_newLocation;
  $$unsubscribe_newLocation = subscribe(newLocation, (value) => $newLocation = value);
  let map;
  let mapElement;
  let leaflet2;
  let mapBound;
  let minRadius = "5";
  let maxRadius = "50";
  let radius = minRadius;
  let coords;
  let fires;
  let click;
  let serviceWorkerRegistration;
  async function setFires(mapBound2) {
    const date = /* @__PURE__ */ new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1e3);
    const formattedDate = localDate.toISOString().split("T")[0];
    let icon = leaflet2.divIcon({
      html: `<div class="text-xl">🔥</div>`,
      className: "",
      iconSize: [22, 22]
    });
    axios.defaults.baseURL = "https://firms.modaps.eosdis.nasa.gov";
    const response = (await axios.get(`/api/area/csv/7582abe461432d62b73c44214d87cc3b/MODIS_NRT/${mapBound2.west},${mapBound2.south},${mapBound2.east},${mapBound2.north}/1/${formattedDate}`)).data;
    fires = parse(response, { columns: true, skip_empty_lines: true });
    fires.forEach((fire) => {
      leaflet2.marker([fire.latitude, fire.longitude], { icon }).addTo(map);
    });
    sendNotifications();
  }
  function isInsideNotificationCircle(point) {
    const inMeters = 111.319488 * Math.cos(coords[0] * Math.PI / 180);
    return ((coords[0] - point[0]) ** 2 + (coords[1] - point[1]) ** 2) ** 0.5 <= radius / inMeters;
  }
  function sendNotifications() {
    for (const fire of fires) {
      if (isInsideNotificationCircle([fire.latitude, fire.longitude])) {
        serviceWorkerRegistration.showNotification("There is fire near you!");
        break;
      }
    }
  }
  onDestroy(async () => {
  });
  {
    if ($newLocation) {
      set_store_value(newLocation, $newLocation = false, $newLocation);
      coords = [click.lat, click.lng];
      setFires(mapBound);
    }
  }
  $$unsubscribe_newLocation();
  return `<div class="${escape("absolute", true) + " w-screen h-screen top-0 left-0"}" style="z-index: 9999"><div class="w-full h-full flex flex-col justify-center items-center" data-svelte-h="svelte-1plwkdj">Loading...</div></div> <div class="w-screen h-screen flex flex-col"><div class="p-2 flex flex-col space-y-2"><div data-svelte-h="svelte-19nss7r">Radius of notification (Km)</div> <div class="flex flex-row space-x-2"><div>${escape(minRadius)}</div> <input type="range"${add_attribute("min", minRadius, 0)}${add_attribute("max", maxRadius, 0)} class="w-full"${add_attribute("value", radius, 0)}> <div>${escape(maxRadius)}</div></div></div> <div class="flex-grow w-full"${add_attribute("this", mapElement, 0)}></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(LeaftletMap, "LeaftletMap").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
