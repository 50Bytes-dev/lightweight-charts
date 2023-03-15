import { Coordinate } from '../model/coordinate';

import { hitTestSquare } from './series-markers-square';
import { shapeSize } from './series-markers-utils';

export function drawTriangle(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	centerX: Coordinate,
	centerY: Coordinate,
	size: number
): void {
	const triangleSize = shapeSize('triangleUp', size);
	const halfTriangleSize = (triangleSize - 1) / 2;

	ctx.beginPath();
	if (up) {
		ctx.moveTo(centerX, centerY - halfTriangleSize);
		ctx.lineTo(centerX + halfTriangleSize, centerY + halfTriangleSize);
		ctx.lineTo(centerX - halfTriangleSize, centerY + halfTriangleSize);
	} else {
		ctx.moveTo(centerX, centerY + halfTriangleSize);
		ctx.lineTo(centerX + halfTriangleSize, centerY - halfTriangleSize);
		ctx.lineTo(centerX - halfTriangleSize, centerY - halfTriangleSize);
	}

	ctx.fill();
}

export function hitTestTriangle(
	up: boolean,
	centerX: Coordinate,
	centerY: Coordinate,
	size: number,
	x: Coordinate,
	y: Coordinate
): boolean {
	// TODO: implement arrow hit test
	return hitTestSquare(centerX, centerY, size, x, y);
}
