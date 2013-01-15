var browserBoolean = {
	isOpera : !!(window.opera && window.opera.version),  // Opera 8.0+
	isFirefox : testCSS('MozBoxSizing'),                 // FF 0.8+
	isSafari : Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0, // At least Safari 3+: "[object HTMLElementConstructor]"
	isChrome : !this.isSafari && testCSS('WebkitTransform'),  // Chrome 1+
	isIE : /*@cc_on!@*/false || testCSS('msTransform'),  // At least IE6
}

function testCSS(prop) {
	return prop in document.documentElement.style;
}
