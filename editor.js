'use strict';

const svgout = document.getElementById('svgout');
const polygonTool = document.getElementById('polygon');
const rectTool = document.getElementById('rect');
const circleTool = document.getElementById('circle');
const ellipseTool = document.getElementById('ellipse');

let startPt = null;
let svgoutUnitHori = 100, svgoutUnitVert = 100;
let activeTool = null;

function screenToSvgCd(screenCd) {
	const svgoutRect = svgout.getBoundingClientRect();
	const viewboxWidth = 100;
	const viewboxHeight = 100;
	const viewboxRatio = viewboxWidth / viewboxHeight;

	if (svgoutRect.width / svgoutRect.height > viewboxRatio) {
		const viewboxWidthInPx = svgoutRect.height * viewboxRatio;
		const viewboxPadding = (svgoutRect.width - viewboxWidthInPx) / 2;
		const fracViewboxWidth = (screenCd.x - viewboxPadding - svgoutRect.x) / viewboxWidthInPx;
		return {
			x: fracViewboxWidth * viewboxWidth,
			y: viewboxHeight * (screenCd.y - svgoutRect.y) / svgoutRect.height
		};
	}
	else {
		const viewboxHeightInPx = svgoutRect.width / viewboxRatio;
		const viewboxPadding = (svgoutRect.height - viewboxHeightInPx) / 2;
		const fracViewboxHeight = (screenCd.y - viewboxPadding - svgoutRect.y) / viewboxHeightInPx;
		return {
			x: viewboxWidth * (screenCd.x - svgoutRect.x) / svgoutRect.width,
			y: fracViewboxHeight * viewboxHeight
		};
	}
}

function startRectMouseDown(e) {
	startPt = screenToSvgCd({x: e.clientX, y: e.clientY});
	addEventListener('pointermove', drawingRectMouseMove);
	addEventListener('pointerup', endRectMouseUp, {once:true});
}
function drawingRectMouseMove(e) {
	const tmpfig = document.getElementById('__drawing');
	if (tmpfig) {
		// if temporary drawing figure already exists, delete figure
		tmpfig.remove();
	}
	// create temporary drawing figure
	const endPt = screenToSvgCd({x: e.clientX, y: e.clientY});
	const outputRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	outputRect.setAttribute('x', Math.min(startPt.x, endPt.x));
	outputRect.setAttribute('y', Math.min(startPt.y, endPt.y));
	outputRect.setAttribute('width', Math.abs(endPt.x - startPt.x));
	outputRect.setAttribute('height', Math.abs(endPt.y - startPt.y));
	outputRect.setAttribute('id', '__drawing');
	svgout.append(outputRect);
}
function endRectMouseUp(e) {
	removeEventListener('pointermove', drawingRectMouseMove);
	const endPt = screenToSvgCd({x: e.clientX, y: e.clientY});
	const outputRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	outputRect.setAttribute('x', Math.min(startPt.x, endPt.x));
	outputRect.setAttribute('y', Math.min(startPt.y, endPt.y));
	outputRect.setAttribute('width', Math.abs(endPt.x - startPt.x));
	outputRect.setAttribute('height', Math.abs(endPt.y - startPt.y));
	svgout.append(outputRect);
}
function rectToolHandler(e) {
	// toggle activeTool to/from rect
	if (activeTool !== 'rect') {
		activeTool = 'rect';
		e.currentTarget.style.setProperty('background-color', 'rgb(150,150,150)');
		svgout.addEventListener('pointerdown', startRectMouseDown);
	}
	else {
		activeTool = null;
		e.currentTarget.style.removeProperty('background-color');
		svgout.removeEventListener('pointerdown', startRectMouseDown);
	}
}
function findVH() {
	document.documentElement.style.setProperty('--vh', `${innerHeight/100}px`);
}

rectTool.addEventListener('click', rectToolHandler);
