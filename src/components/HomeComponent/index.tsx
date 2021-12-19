import React from "react";
import { BlurredBlobs } from "./../../styles/styled-components/BlurredBlobs";

export default function HomeComponent() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
      <BlurredBlobs></BlurredBlobs>
    </div>
  );
}
