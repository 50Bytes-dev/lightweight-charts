import { SeriesItemsIndexesRange } from '../model/time-data';

import { BarCandlestickItemBase } from './bars-renderer';
import { LinePoint, LineStyle, LineType, LineWidth, setLineStyle } from './draw-line';
import { ScaledRenderer } from './scaled-renderer';
import { walkLine } from './walk-line';

export interface DominatingItem extends BarCandlestickItemBase {
	topColor?: string;
	middleColor?: string;
	bottomColor?: string;
	background?: string;
	topBackground?: string | string[];
	bottomBackground?: string | string[];
}

export interface PaneRendererDominatingDataBase {
	topLineType: LineType;
	middleLineType: LineType;
	bottomLineType: LineType;

	items: DominatingItem[];

	barWidth: number;

	topLineWidth: LineWidth;
	middleLineWidth: LineWidth;
	bottomLineWidth: LineWidth;

	topLineStyle: LineStyle;
	middleLineStyle: LineStyle;
	bottomLineStyle: LineStyle;

	visibleRange: SeriesItemsIndexesRange | null;
}

export abstract class PaneRendererDominatingBase<TData extends PaneRendererDominatingDataBase> extends ScaledRenderer {
	protected _data: TData | null = null;

	public setData(data: TData): void {
		this._data = data;
	}

	protected _drawImpl(ctx: CanvasRenderingContext2D): void {
		if (this._data === null || this._data.items.length === 0 || this._data.visibleRange === null) {
			return;
		}

		ctx.lineCap = 'butt';
		ctx.lineWidth = this._data.middleLineWidth;

		setLineStyle(ctx, this._data.middleLineStyle);

		ctx.strokeStyle = this._strokeStyle(ctx);
		ctx.lineJoin = 'round';

		if (this._data.items.length === 1) {
			ctx.beginPath();

			const point = this._data.items[0];
			ctx.moveTo(point.x - this._data.barWidth / 2, point.closeY);
			ctx.lineTo(point.x + this._data.barWidth / 2, point.closeY);

			if (point.middleColor !== undefined) {
				ctx.strokeStyle = point.middleColor;
			}

			ctx.stroke();
		} else {
			this._drawArea(ctx, this._data);
			this._drawTopLine(ctx, this._data);
			this._drawBottomLine(ctx, this._data);
			this._drawMiddleLine(ctx, this._data);
		}
	}

	protected _drawArea(ctx: CanvasRenderingContext2D, data: TData): void {
		ctx.beginPath();
		const topPoints = data.items.map((p: DominatingItem) => ({ x: p.x, y: p.highY })) as LinePoint[];
		walkLine(ctx, topPoints, data.topLineType, data.visibleRange as SeriesItemsIndexesRange);
		ctx.stroke();
	}

	protected _drawTopLine(ctx: CanvasRenderingContext2D, data: TData): void {
		ctx.beginPath();
		const topPoints = data.items.map((p: DominatingItem) => ({ x: p.x, y: p.highY })) as LinePoint[];
		walkLine(ctx, topPoints, data.topLineType, data.visibleRange as SeriesItemsIndexesRange);
		ctx.stroke();
	}

	protected _drawMiddleLine(ctx: CanvasRenderingContext2D, data: TData): void {
		ctx.beginPath();
		const topPoints = data.items.map((p: DominatingItem) => ({ x: p.x, y: p.highY })) as LinePoint[];
		walkLine(ctx, topPoints, data.topLineType, data.visibleRange as SeriesItemsIndexesRange);
		ctx.stroke();
	}

	protected _drawBottomLine(ctx: CanvasRenderingContext2D, data: TData): void {
		ctx.beginPath();
		const topPoints = data.items.map((p: DominatingItem) => ({ x: p.x, y: p.highY })) as LinePoint[];
		walkLine(ctx, topPoints, data.topLineType, data.visibleRange as SeriesItemsIndexesRange);
		ctx.stroke();
	}

	protected abstract _strokeStyle(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D['strokeStyle'];
}

export interface PaneRendererDominatingData extends PaneRendererDominatingDataBase {
	topLineColor: string;
	middleLineColor: string;
	bottomLineColor: string;
	topBackground: string | string[];
	bottomBackground: string | string[];
}

interface VectorPoint {
	x: number;
	y: number;
}

interface Vector {
	start: VectorPoint;
	end: VectorPoint;
}

export class PaneRendererDominating extends PaneRendererDominatingBase<PaneRendererDominatingData> {
	/**
	 * Similar to {@link walkLine}, but supports color changes
	 */
	// eslint-disable-next-line complexity
	protected override _drawArea(ctx: CanvasRenderingContext2D, data: PaneRendererDominatingData): void {
		const { items, visibleRange } = data;

		if (items.length === 0 || visibleRange === null) {
			return;
		}

		ctx.beginPath();

		const firstItem = items[visibleRange.from];
		ctx.moveTo(firstItem.x, firstItem.highY);

		for (let i = visibleRange.from; i < visibleRange.to; ++i) {
			if (i < 0) {
				continue;
			}

			const currItem = items[i];
			const prevItem = items[i - 1];

			if (currItem) {
				if (prevItem) {
					const intersection = this.vectorIntersection(
						{
							start: { x: prevItem.x, y: prevItem.highY },
							end: { x: currItem.x, y: currItem.highY },
						},
						{
							start: { x: prevItem.x, y: prevItem.closeY },
							end: { x: currItem.x, y: currItem.closeY },
						}
					);
					if (intersection) {
						ctx.lineTo(intersection.x, intersection.y);
					}
				}
				if (currItem.highY < currItem.closeY) {
					ctx.lineTo(currItem.x, currItem.highY);
				} else {
					ctx.lineTo(currItem.x, currItem.closeY);
				}
			}
		}

		for (let i = visibleRange.to - 1; i >= visibleRange.from; --i) {
			if (i < 0) {
				continue;
			}

			const currItem = items[i];
			if (currItem) {
				ctx.lineTo(currItem.x, currItem.closeY);
			}
		}

		if (Array.isArray(this._data?.topBackground)) {
			ctx.fillStyle = this._data?.topBackground[0] || 'transparent';
		} else {
			ctx.fillStyle = this._data?.topBackground || 'transparent';
		}
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(firstItem.x, firstItem.highY);

		for (let i = visibleRange.from; i < visibleRange.to; ++i) {
			if (i < 0) {
				continue;
			}

			const currItem = items[i];
			const prevItem = items[i - 1];

			if (currItem) {
				if (prevItem) {
					const intersection = this.vectorIntersection(
						{
							start: { x: prevItem.x, y: prevItem.highY },
							end: { x: currItem.x, y: currItem.highY },
						},
						{
							start: { x: prevItem.x, y: prevItem.closeY },
							end: { x: currItem.x, y: currItem.closeY },
						}
					);
					if (intersection) {
						ctx.lineTo(intersection.x, intersection.y);
					}
				}
				if (currItem.highY > currItem.closeY) {
					ctx.lineTo(currItem.x, currItem.highY);
				} else {
					ctx.lineTo(currItem.x, currItem.closeY);
				}
			}
		}

		for (let i = visibleRange.to - 1; i >= visibleRange.from; --i) {
			if (i < 0) {
				continue;
			}

			const currItem = items[i];
			if (currItem) {
				ctx.lineTo(currItem.x, currItem.closeY);
			}
		}

		if (Array.isArray(this._data?.bottomBackground)) {
			ctx.fillStyle = this._data?.bottomBackground[0] || 'transparent';
		} else {
			ctx.fillStyle = this._data?.bottomBackground || 'transparent';
		}
		ctx.fill();
		ctx.closePath();
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	protected vectorIntersection(vector1: Vector, vector2: Vector): VectorPoint | null {
		const x1 = vector1.start.x;
		const y1 = vector1.start.y;
		const x2 = vector1.end.x;
		const y2 = vector1.end.y;
		const x3 = vector2.start.x;
		const y3 = vector2.start.y;
		const x4 = vector2.end.x;
		const y4 = vector2.end.y;

		const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

		if (denom === 0) {
			return null;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

		if (t > 0 && t < 1 && u > 0 && u < 1) {
			return {
				x: x1 + t * (x2 - x1),
				y: y1 + t * (y2 - y1),
			};
		}
		return null;
	}

	protected override _drawTopLine(ctx: CanvasRenderingContext2D, data: PaneRendererDominatingData): void {
		const { items, visibleRange } = data;
		if (items.length === 0 || visibleRange === null) {
			return;
		}

		ctx.beginPath();
		const firstItem = items[visibleRange.from];
		ctx.moveTo(firstItem.x, firstItem.highY);

		for (let i = visibleRange.from; i < visibleRange.to; ++i) {
			if (i < 0) {
				continue;
			}

			// const nextItem = items[i + 1];
			const currItem = items[i];
			const prevItem = items[i - 1];

			if (currItem) {
				if (prevItem) {
					const intersection = this.vectorIntersection(
						{
							start: { x: prevItem.x, y: prevItem.highY },
							end: { x: currItem.x, y: currItem.highY },
						},
						{
							start: { x: prevItem.x, y: prevItem.closeY },
							end: { x: currItem.x, y: currItem.closeY },
						}
					);
					if (intersection) {
						ctx.lineTo(intersection.x, intersection.y);
					}
				}
				if (currItem.highY < currItem.closeY) {
					ctx.lineTo(currItem.x, currItem.highY);
				} else {
					ctx.lineTo(currItem.x, currItem.closeY);
				}
			}
		}

		ctx.strokeStyle = this._data?.topLineColor || 'transparent';
		ctx.lineWidth = this._data?.topLineWidth || 1;
		setLineStyle(ctx, this._data?.topLineStyle || LineStyle.Solid);
		ctx.stroke();
	}

	protected override _drawMiddleLine(ctx: CanvasRenderingContext2D, data: PaneRendererDominatingData): void {
		const { items, visibleRange } = data;
		if (items.length === 0 || visibleRange === null) {
			return;
		}

		ctx.beginPath();
		const firstItem = items[visibleRange.from];
		ctx.moveTo(firstItem.x, firstItem.highY);

		for (let i = visibleRange.from; i < visibleRange.to; ++i) {
			if (i < 0) {
				continue;
			}

			const currItem = items[i];

			if (currItem) {
				ctx.lineTo(currItem.x, currItem.closeY);
			}
		}

		ctx.strokeStyle = this._data?.middleLineColor || 'transparent';
		ctx.lineWidth = this._data?.middleLineWidth || 1;
		setLineStyle(ctx, this._data?.middleLineStyle || LineStyle.Solid);
		ctx.stroke();
	}

	protected override _drawBottomLine(ctx: CanvasRenderingContext2D, data: PaneRendererDominatingData): void {
		const { items, visibleRange } = data;
		if (items.length === 0 || visibleRange === null) {
			return;
		}

		ctx.beginPath();
		const firstItem = items[visibleRange.from];
		ctx.moveTo(firstItem.x, firstItem.highY);

		for (let i = visibleRange.from; i < visibleRange.to; ++i) {
			if (i < 0) {
				continue;
			}

			const currItem = items[i];
			const prevItem = items[i - 1];

			if (currItem) {
				if (prevItem) {
					const intersection = this.vectorIntersection(
						{
							start: { x: prevItem.x, y: prevItem.highY },
							end: { x: currItem.x, y: currItem.highY },
						},
						{
							start: { x: prevItem.x, y: prevItem.closeY },
							end: { x: currItem.x, y: currItem.closeY },
						}
					);
					if (intersection) {
						ctx.lineTo(intersection.x, intersection.y);
					}
				}
				if (currItem.highY > currItem.closeY) {
					ctx.lineTo(currItem.x, currItem.highY);
				} else {
					ctx.lineTo(currItem.x, currItem.closeY);
				}
			}
		}

		ctx.strokeStyle = this._data?.bottomLineColor || 'transparent';
		ctx.lineWidth = this._data?.bottomLineWidth || 1;
		setLineStyle(ctx, this._data?.bottomLineStyle || LineStyle.Solid);
		ctx.stroke();
	}

	protected override _strokeStyle(): CanvasRenderingContext2D['strokeStyle'] {
		return this._data?.middleLineColor || 'red';
	}
}
