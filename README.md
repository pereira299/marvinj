# Marvin-TS
Marvin-TS is Typescript version of Marvin Image Processing Framework with some more features and updates.

## Tutorial

### Install

You can install from npm or yarn

**NPM**
```
npm i marvin-ts
```

**Yarn**
```
yarn add marvin-ts
```
### Image Loading
The first step to use Marvin-TS is load a image.
```
   import { MarvinImage } from "marvin-ts"

   // load from remote image
   let url = "http://ww.exemple.com/image.jpg";
   const image = await new MarvinImage().load(url);

   // or load from local image
   let url2 = fs.readSyncFile("image.png");
   const image2 = await new MarvinImage().loadFromBase64(url2);
```
### Marvin instance
Before load image you need create a new Marvin instance

```
   import Marvin, { MarvinImage } from "marvin-ts"
   ...
   ...
   // image is the MarvinImage instance the you create before
   const marvin = new Marvin(image);

   // Now you can use all features of Marvin-TS
```

## Features
### Blur
```
   
```
### Color
```
   
```
### Combine
```
   
```
### Corner
```
   
```
### Draw
```
   
```
### Edge
```
   
```
### Pattern
```
   
```
### Restoration
```
   
```
### Segment
```
   
```
### Transform
```
   
```
### Get or save
```
   
```

This project is a fork of [MarvinJ](http://marvinj.org/)

