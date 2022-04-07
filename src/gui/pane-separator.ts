import { IDestroyable } from '../helpers/idestroyable';
import { Delegate } from '../helpers/delegate';
import { clamp } from '../helpers/mathex';

import { createPreconfiguredCanvas, getContext2D, Size } from './canvas-utils';
import { ChartWidget, PaneEventParamsImplSupplier } from './chart-widget';
import { MouseEventHandler, MouseEventHandlers, TouchMouseEvent } from './mouse-event-handler';
import { PaneWidget } from './pane-widget';

export const SEPARATOR_HEIGHT = 1;

export class PaneSeparator implements IDestroyable {
	private readonly _chartWidget: ChartWidget;
	private readonly _rowElement: HTMLTableRowElement;
	private readonly _cell: HTMLTableCellElement;
	private readonly _handle: HTMLDivElement | null;
	private readonly _mouseEventHandler: MouseEventHandler | null;
	private readonly _paneA: PaneWidget;
	private readonly _paneB: PaneWidget;

	private readonly _topPaneIndex: number;
	private readonly _bottomPaneIndex: number;

	private readonly _resizeDelegate: Delegate<PaneEventParamsImplSupplier>;

	private _startY: number = 0;
	private _deltaY: number = 0;
	private _totalHeight: number = 0;
	private _totalStretch: number = 0;
	private _minPaneHeight: number = 0;
	private _maxPaneHeight: number = 0;
	private _pixelStretchFactor: number = 0;
	private _mouseActive: boolean = false;

	public constructor(chartWidget: ChartWidget, topPaneIndex: number, bottomPaneIndex: number, disableResize: boolean, resizeDelegate: Delegate<PaneEventParamsImplSupplier>) {
		this._chartWidget = chartWidget;
		this._paneA = chartWidget.paneWidgets()[topPaneIndex];
		this._paneB = chartWidget.paneWidgets()[bottomPaneIndex];

		this._rowElement = document.createElement('tr');
		this._rowElement.style.height = SEPARATOR_HEIGHT + 'px';

		this._topPaneIndex = topPaneIndex;
		this._bottomPaneIndex = bottomPaneIndex;
		this._resizeDelegate = resizeDelegate;

		this._cell = document.createElement('td');
		this._cell.style.position = 'relative';
		this._cell.style.padding = '0';
		this._cell.style.margin = '0';
		this._cell.setAttribute('colspan', '3');

		this._updateBorderColor();
		this._rowElement.appendChild(this._cell);

		if (disableResize) {
			this._handle = null;
			this._mouseEventHandler = null;
		} else {
			this._handle = document.createElement('div');
			this._handle.style.position = 'absolute';
			this._handle.style.zIndex = '50';
			this._handle.style.top = '-4px';
			this._handle.style.height = '9px';
			this._handle.style.width = '100%';
			this._handle.style.backgroundColor = '';
			this._handle.style.cursor = 'row-resize';
			this._cell.appendChild(this._handle);
			const handlers: MouseEventHandlers = {
				mouseEnterEvent: this._mouseOverEvent.bind(this),
				mouseLeaveEvent: this._mouseLeaveEvent.bind(this),
				mouseDownEvent: this._mouseDownEvent.bind(this),
				touchStartEvent: this._mouseDownEvent.bind(this),
				pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
				touchMoveEvent: this._pressedMouseMoveEvent.bind(this),
				mouseUpEvent: this._mouseUpEvent.bind(this),
				touchEndEvent: this._mouseUpEvent.bind(this),
			};
			this._mouseEventHandler = new MouseEventHandler(
				this._handle,
				handlers,
				{
					treatVertTouchDragAsPageScroll: () => false,
					treatHorzTouchDragAsPageScroll: () => true,
				}
			);
		}
	}

	public destroy(): void {
		if (this._mouseEventHandler !== null) {
			this._mouseEventHandler.destroy();
		}
	}

	public getElement(): HTMLElement {
		return this._rowElement;
	}

	public getSize(): Readonly<Size> {
		return new Size(this._paneA.getSize().w, SEPARATOR_HEIGHT);
	}

	public getImage(): HTMLCanvasElement {
		const size = this.getSize();
		const res = createPreconfiguredCanvas(document, size);
		const ctx = getContext2D(res);
		ctx.fillStyle = this._chartWidget.options().timeScale.borderColor;
		ctx.fillRect(0, 0, size.w, size.h);
		return res;
	}

	public update(): void {
		this._updateBorderColor();
	}

	private _updateBorderColor(): void {
		this._cell.style.background = this._chartWidget.options().timeScale.borderColor;
	}

	private _mouseOverEvent(event: TouchMouseEvent): void {
		if (this._handle !== null) {
			this._handle.style.backgroundColor = 'hsla(225,8%,72%,.2)';
		}
	}

	private _mouseLeaveEvent(event: TouchMouseEvent): void {
		if (this._handle !== null && !this._mouseActive) {
			this._handle.style.backgroundColor = '';
		}
	}
	private _mouseDownEvent(event: TouchMouseEvent): void {
		this._startY = event.pageY;
		this._deltaY = 0;
		this._totalHeight = this._paneA.getSize().h + this._paneB.getSize().h;
		this._totalStretch = this._paneA.stretchFactor() + this._paneB.stretchFactor();
		this._minPaneHeight = 30;
		this._maxPaneHeight = this._totalHeight - this._minPaneHeight;
		this._pixelStretchFactor = this._totalStretch / this._totalHeight;
		this._mouseActive = true;
	}

	private _pressedMouseMoveEvent(event: TouchMouseEvent): void {
		this._deltaY = (event.pageY - this._startY);
		const upperHeight = this._paneA.getSize().h;
		const newUpperPaneHeight = clamp(upperHeight + this._deltaY, this._minPaneHeight, this._maxPaneHeight);

		const newUpperPaneStretch = newUpperPaneHeight * this._pixelStretchFactor;
		const newLowerPaneStretch = this._totalStretch - newUpperPaneStretch;
		this._paneA.setStretchFactor(newUpperPaneStretch);
		this._paneB.setStretchFactor(newLowerPaneStretch);
		this._chartWidget.adjustSize();
		if (this._paneA.getSize().h !== upperHeight) {
			this._startY = event.pageY;
		}
		this._chartWidget.model().fullUpdate();
		this._resizeDelegate.fire(() => ({
			top: {
				index: this._topPaneIndex,
				height: this._paneA.getSize().h,
			},
			bottom: {
				index: this._bottomPaneIndex,
				height: this._paneB.getSize().h,
			},
		}));
	}

	private _mouseUpEvent(event: TouchMouseEvent): void {
		this._startY = 0;
		this._deltaY = 0;
		this._totalHeight = 0;
		this._totalStretch = 0;
		this._minPaneHeight = 0;
		this._maxPaneHeight = 0;
		this._pixelStretchFactor = 0;
		this._mouseActive = false;
		this._mouseLeaveEvent(event);
	}
}
