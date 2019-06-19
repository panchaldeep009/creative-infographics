<p align="center">
  <a href="https://github.com/panchaldeep009/creative-infographics/" rel="noopener" target="_blank"><img width="200" src="https://drive.google.com/uc?export=view&id=1e_DnF9VbeM5TSpLbVGO5M1svU1qA14GD" alt="creative-infographics logo"></a></p>
</p>

<h1 align="center">creative-infographics</h1>

<div align="center">
  
This is a library of interactive infographics [React](https://reactjs.org/) components for challenging data visualization.
  
[![npm package](https://img.shields.io/npm/v/creative-infographics/latest.svg?color=green)](https://www.npmjs.com/package/creative-infographics)
[![npm downloads](https://img.shields.io/npm/dw/@creative-infographics.svg?color=green)](https://www.npmjs.com/package/creative-infographics)
[![npm size](https://img.shields.io/bundlephobia/min/creative-infographics.svg?color=green)](https://www.npmjs.com/package/creative-infographics)
[![npm peer](https://img.shields.io/npm/dependency-version/creative-infographics/peer/react.svg?color=cyan&label=%F0%9F%94%AF%20react)](https://www.npmjs.com/package/creative-infographics)
[![repo licence](https://img.shields.io/github/license/panchaldeep009/creative-infographics.svg?color=blue)](https://github.com/panchaldeep009/creative-infographics/blob/master/LICENSE)
[![repo size](https://img.shields.io/github/repo-size/panchaldeep009/creative-infographics.svg?color=gold)](https://github.com/panchaldeep009/creative-infographics)
[![repo lang](https://img.shields.io/github/languages/top/panchaldeep009/creative-infographics.svg?color=gold)](https://github.com/panchaldeep009/creative-infographics)
[![git stars](https://img.shields.io/github/stars/panchaldeep009/creative-infographics.svg?style=social)](https://github.com/panchaldeep009/creative-infographics)
[![git watch](https://img.shields.io/github/watchers/panchaldeep009/creative-infographics.svg?style=social&label=Watch)](https://github.com/panchaldeep009/creative-infographics)
[![git follow](https://img.shields.io/github/followers/panchaldeep009.svg?style=social&label=Followers:%20panchaldeep009)](https://github.com/panchaldeep009)
![open source](https://img.shields.io/badge/open%20source-%E2%9D%A4-hotPink.svg)

</div>

# ⏬ Installation

Creative-Infographics is available as an [npm package](https://www.npmjs.com/package/creative-infographics).

```sh
// with npm
npm  install creative-infographics
```

## Usage

For each infographic component there is fixed data schema and reaquired props, see the followed documentation below.

## Infographics

### 1) FlowerGraph

<img width="400" src="https://drive.google.com/uc?export=view&id=1UbHZ2eMjFvBKszrpYLedgAJKHOMBGp6c" alt="flowerGraph">

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creative-infographic-829ds)

- Import FlowerGraph

```jsx
import { FlowerGraph } from "creative-infographics";
```

- component schema

```jsx
<FlowerGraph data={/* data */} label={/* key name of label */} term={/* key name of type */} />
```

#### Data schema for FlowerGraph

- following data schema is required to render this infographic.

```js
data /* array_of_objects */ = [
    {
      /* key_for_label */ : /* label */,
      /* key_for_type */ : /* array of distinguished values of string|number */ [ "type_a", "type_b", ...]
      ...
    },
    ...
]
```

### Props

Using following props, Info-graphic can be customize as per required.

| props          | type                          | Default values | Description                                                                         |
| -------------- | ----------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| data           | array of objects              | _\*required_   | This prop requires data as per shown in [data schema](#Data-schema-for-FlowerGraph) |
| label          | string                        | _\*required_   | This is key name of text label inside objects                                       |
| term           | string                        | _\*required_   | This is key name of array of types inside objects                                   |
| leafs          | integer                       | 5              | Number of flower leafs                                                              |
| leafR          | integer                       | 55             | leafs Radius                                                                        |
| leafDeg        | integer                       | 270            | Round cut off of leafs circle in degree                                             |
| flowerR        | integer                       | 195            | Flower root Radius                                                                  |
| flowerDeg      | integer                       | 360            | Round cut off of Flower circle in degree                                            |
| flowerRotation | integer                       | 0              | Rotation of Flower                                                                  |
| fontSize       | integer                       | 6              | text size                                                                           |
| fadingOpacity  | float                         | 0.02           | Opacity of other elements on mouse hover **range : 0.0 to 1**                       |
| luminosity     | string ("bright" \| "dark")   | "bright"       | "bright" : for white text and bright colors, "dark": for black text and dark colors |
| tint           | bool \| string(_colors_only_) | false          | false : random colors, "_color_names_" : gives shades of colors (red, blue, ..)     |

## License

This project is licensed under the terms of the
[ISC license](https://github.com/panchaldeep009/creative-infographics/blob/master/LICENSE).
