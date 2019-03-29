function randomInt( min, max ) {
	return Math.round(randomFloat(min, max));
}
function randomFloat( min, max ) {
	return Math.random() * ( max - min ) + min;
}
function degreesToRads(degrees) {
	return degrees / 180 * Math.PI;
}
