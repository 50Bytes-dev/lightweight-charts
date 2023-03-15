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

			if (currItem) {
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

			if (currItem) {
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

			const currItem = items[i];

			if (currItem) {
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
				if (currItem.highY > currItem.closeY) {
					ctx.lineTo(currItem.x, currItem.highY);
				} else if (prevItem?.highY > prevItem?.closeY) {
					/* const m1 = (prevItem.highY - currItem.highY) / (prevItem.x - currItem.x);
					const m2 = (prevItem.closeY - currItem.closeY) / (prevItem.x - currItem.x);

					const b1 = currItem.highY;
					const b2 = currItem.closeY;

					ctx.lineTo((currItem.x + prevItem.x) / 2, (currItem.highY + prevItem.highY) / 2);*/
					ctx.lineTo(currItem.x, currItem.closeY);
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
