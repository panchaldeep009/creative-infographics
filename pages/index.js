import React, { useState } from "react";

import { FlowerGraph } from "../src";
import movies from "./data/movies_data.json";

const Home = () => {
  const [perms, setPerms] = useState({
    fontSize: 6,
    fadingOpacity: 0.02,
    flowerX: 300,
    flowerY: 400,
    flowerR: 195,
    flowerDeg: 360,
    flowerRotation: 40,
    leafs: 6,
    leafsR: 60,
    leafsDeg: 270,
    luminosity: "bright",
    tint: false,
    shuffleData: true
  });

  const handlePerms = name => event => {
    setPerms({ ...perms, [name]: parseFloat(event.target.value) });
  };

  const data = movies
    .map(
      movie =>
        movie.Genre && { Title: movie.Title, Genre: movie.Genre.split(", ") }
    )
    .filter(m => m != undefined);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div>
        <p>leafs: {perms.leafs}</p>
        <input
          type="range"
          min="1"
          max="25"
          value={perms.leafs}
          onChange={handlePerms("leafs")}
        />
        <p>leafs Radius: {perms.leafsR}</p>
        <input
          type="range"
          min="-360"
          max="360"
          value={perms.leafsR}
          onChange={handlePerms("leafsR")}
        />
        <p>leafs Degree: {perms.leafsDeg}</p>
        <input
          type="range"
          min="-360"
          max="360"
          value={perms.leafsDeg}
          onChange={handlePerms("leafsDeg")}
        />
        <p>Flower Radius: {perms.flowerR}</p>
        <input
          type="range"
          min="-360"
          max="360"
          value={perms.flowerR}
          onChange={handlePerms("flowerR")}
        />
        <p>Flower Degree: {perms.flowerDeg}</p>
        <input
          type="range"
          min="-360"
          max="360"
          value={perms.flowerDeg}
          onChange={handlePerms("flowerDeg")}
        />
        <p>Flower Rotation: {perms.flowerRotation}</p>
        <input
          type="range"
          min="-360"
          max="360"
          value={perms.flowerRotation}
          onChange={handlePerms("flowerRotation")}
        />
        <p>Font Size: {perms.fontSize}</p>
        <input
          type="range"
          min="1"
          max="32"
          value={perms.fontSize}
          onChange={handlePerms("fontSize")}
        />
        <p>Hover Opacity Size: {perms.fadingOpacity}</p>
        <input
          type="number"
          value={perms.fadingOpacity}
          onChange={handlePerms("fadingOpacity")}
        />
        <p>Luminosity: {perms.luminosity}</p>
        <select
          value={perms.luminosity}
          onChange={e => setPerms({ ...perms, luminosity: e.target.value })}
        >
          <option value="bright">bright</option>
          <option value="dark">dark</option>
        </select>
        <p>Enable Tint: {perms.tint}</p>
        <input
          type="checkbox"
          checked={perms.tint}
          onChange={e => setPerms({ ...perms, tint: e.target.checked })}
        />
        <p>Tint color: {perms.tint}</p>
        <input
          type="text"
          value={perms.tint}
          onChange={e => setPerms({ ...perms, tint: e.target.value })}
          disabled={!perms.tint}
        />
      </div>

      <div
        style={{
          backgroundColor: perms.luminosity == "bright" ? "#555" : "#fff",
          height: "100vh",
          width: "100%"
        }}
      >
        <FlowerGraph data={data} term={"Genre"} label={"Title"} {...perms} />
      </div>
    </div>
  );
};

export default Home;
