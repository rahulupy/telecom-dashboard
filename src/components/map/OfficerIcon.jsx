import L from "leaflet";

const officerIcon = new L.DivIcon({
  html: `
    <div class="officer-marker">
      <div class="pulse"></div>
      <div class="dot"></div>
    </div>
  `,
  className: "",
  iconSize: [30, 30],
});

export default officerIcon;