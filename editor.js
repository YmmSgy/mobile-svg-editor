'use strict';

const debugBar = document.getElementById('debugbar');

// data of toolbar currently being moved
const toolbarMoveData = {
	toolbar: null,
	pOffsetX: null,
	pOffsetY: null
};
function toolbarStartDragHandler(e) {
	toolbarMoveData.toolbar = e.currentTarget;

	// get initial left and top css properties
	const toolbarStyle = getComputedStyle(toolbarMoveData.toolbar);
	const leftValue = toolbarStyle.left.match(/[\d\.]+(?=px)/);
	const topValue = toolbarStyle.top.match(/[\d\.]+(?=px)/);

	// save initial pointer offset
	toolbarMoveData.pOffsetX = e.clientX - leftValue;
	toolbarMoveData.pOffsetY = e.clientY - topValue;

	document.body.addEventListener('pointermove', toolbarDragHandler);
	document.body.addEventListener('pointerup', toolbarEndDragHandler, {once: true});
}
function toolbarDragHandler(e) {
	toolbarMoveData.toolbar.classList.add('movingToolbar');
	toolbarMoveData.toolbar.style.left = `${e.clientX - toolbarMoveData.pOffsetX}px`;
	toolbarMoveData.toolbar.style.top = `${e.clientY - toolbarMoveData.pOffsetY}px`;
}
function toolbarEndDragHandler(e) {
	toolbarMoveData.toolbar.classList.remove('movingToolbar');
	document.body.removeEventListener('pointermove', toolbarDragHandler);
}

// setup toolbar object to hold references to toolbars
const toolbars = {};
for (const toolbar of document.getElementsByClassName('toolbarCollection')) {
	toolbar.addEventListener('pointerdown', toolbarStartDragHandler);
	toolbars[toolbar.id] = toolbar;
}
