import { Vector3 } from "three";

export const BikeData = [
  {
    name: "FrontWheel_Bicycle_0",
    heading: "Front Wheel",
    label: "High-traction front tire for urban riding",
    point: new Vector3(0.041, 0.13, 0.64),
  },
  {
    name: "RearWheel_Bicycle_0",
    heading: "Rear Wheel",
    label: "Direct-drive rear hub with durable tire",
    point: new Vector3(0.04, 0.15, -0.6),
  },
  {
    name: "Handle_Bicycle_0",
    heading: "Handlebars",
    label: "Ergonomic handlebars with integrated controls",
    point: new Vector3(0, 0.48, 0.34),
  },
  {
    name: "Seat_Bicycle_0",
    heading: "Saddle",
    label: "Comfort saddle with pressure-relief cushioning",
    point: new Vector3(0.02, 0.35, -0.31),
  },
  {
    name: "Chain_Chain_0",
    heading: "Chain",
    label: "Rust-resistant drive chain for smooth motion",
    point: new Vector3(-0.037, -0.32, -0.177),
  },
  {
    name: "Pedalier_Bicycle_0",
    heading: "Crankset",
    label: "Lightweight crankset for efficient power transfer",
    point: new Vector3(-0.06, -0.2, -0.075),
  },
  {
    name: "Pedal_Left_Bicycle_0",
    heading: "Left Pedal",
    label: "High-grip left pedal platform",
    point: new Vector3(0.09, -0.08, -0.075),
  },
  {
    name: "Pedal_Right_Bicycle_0",
    heading: "Right Pedal",
    label: "High-grip right pedal platform",
    point: new Vector3(-0.09, -0.33, -0.074), // ✅ FIXED
  },
];
