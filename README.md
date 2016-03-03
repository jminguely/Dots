# Dots system for the Biopôle Project

## Installation
Clone/download the project and then include the following scripts/snippets in your project:
```sh
<link rel="stylesheet" href="dist/dots-grid.css">
<script type="text/javascript" src="dist/webfont.min.js"></script>
<script type="text/javascript" src="dist/pixi.min.js"></script>
<script type="text/javascript" src="dist/zepto.min.js"></script>
<script type="text/javascript" src="dist/dots-grid.js"></script>
```

And then include the following code in your site:
```sh
<div class="canvasContainer">
	<canvas id="grid"></canvas> 
	<div class="overlay">
		<div class="content">
		</div>
	</div>
</div>
```

## Initialise
When the dom is ready, launch the function "initializeGrid"
```sh
$(document).ready(function(){
	initializeGrid();
});
```

## JSON
To add some interactive points to the grid, you need to include a script containing a variable "gridElements" and containing an Array with the specified dots

Here are the parameters for each element-dots:

#### dotX / dotY
Position in percentage. 
Top left is 0 / 0. 
Bottom Right is 100 / 100

#### overlayX / overlayY
Distance in dots of the position of the tooltip from the initial interactive dot. 

#### w / h
Width & Height of the tooltip to be open
In pixels

#### anchorX / anchorY
Anchor of the tooltip. Point where the tooltip is place in relation from the initail dot
In pixels

#### animation
Type of animation to be displayed on the grid when the tooltip opens
```sh
0: Oblique
1: Inversed Oblique
2: Cross
3: Asymetric Cross (Top-Left) 
4: Asymetric Cross (Top-Right) 
5: Asymetric Cross (Bottom-Right) 
6: Asymetric Cross (Bottom-Left) 
7: "L"
8: Inversed "L"
9: Arrow
10: Inversed Arrow
11: Square
12: Mirror Symtry from "L"
```

#### titleLatestNews
Display the title Latest News (near the square animation)

#### type
Type of the content to be displayed on click
```sh
keywords: floating keywords
html: embed html
```

#### src
Html code to be placed in the tooltip (for an HTML type of element)

#### content
List of keywords to be displayed. (for a keywords type of element)

## Notes

If there is no elements, the grid will be displayed anyway. Userful if you want to use the interactive grid without element, as a background.

See http://php.net/manual/en/function.json-encode.php for more infos about printing js compatible array from php

## Credit
Julien Minguely - jminguely@gmail.com


