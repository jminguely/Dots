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
0: Diagonale
1: Croix désaxée
2: Croix 
3: "L"
4: Flèche
5: Carré
```

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

## Note

See http://php.net/manual/en/function.json-encode.php for more infos about printing js compatible array from php

## Credit
Julien Minguely - jminguely@gmail.com


