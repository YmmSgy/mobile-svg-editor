'use strict';

/* const downloadLink = document.getElementById('downloadLink');

const dlUrl = URL.createObjectURL(new File(
	['Hello World!\n'], '', {type: 'text/plain'}
));
downloadLink.setAttribute('href', dlUrl); */

// setup toolbar object to reference toolbars
const toolbars = {};
for (const toolbar of document.getElementsByClassName('toolbarCollection')) {
	// make every toolbar draggable
	toolbar.addEventListener('dragstart', e => {
		const cs = getComputedStyle(e.currentTarget);
		const toolbarData = {
			name: e.currentTarget.id,
			xOffset: e.clientX - Number(cs.left.match(/\d+(?=px)/)),
			yOffset: e.clientY - Number(cs.top.match(/\d+(?=px)/))
		};
		e.dataTransfer.setData('application/toolbar', JSON.stringify(toolbarData));
		e.dataTransfer.setData('text/plain', e.currentTarget.id);
	});
	toolbars[toolbar.id] = toolbar;
}

document.body.addEventListener('dragenter', e => {
	if (e.dataTransfer.types.includes('application/toolbar')) e.preventDefault();
});
document.body.addEventListener('dragover', e => {
	if (e.dataTransfer.types.includes('application/toolbar')) e.preventDefault();
});
document.body.addEventListener('drop', e => {
	e.preventDefault();
	const toolbarData = JSON.parse(e.dataTransfer.getData('application/toolbar'));
	toolbars[toolbarData.name].style.left = `${e.clientX - toolbarData.xOffset}px`;
	toolbars[toolbarData.name].style.top = `${e.clientY - toolbarData.yOffset}px`;
})
