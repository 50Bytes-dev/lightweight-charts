import { SeriesBarColorer } from '../../model/series-bar-colorer';
import { SeriesPlotRow } from '../../model/series-data';
import { TimePointIndex } from '../../model/time-data';
import {
	DominatingItem, PaneRendererDominating, PaneRendererDominatingData,
} from '../../renderers/dominating-renderer';
import { IPaneRenderer } from '../../renderers/ipane-renderer';

import { DominatingPaneViewBase } from './dominating-pane-view-base';

export class SeriesDominatingPaneView extends DominatingPaneViewBase<'Dominating', DominatingItem> {
	private readonly _renderer: PaneRendererDominating = new PaneRendererDominating();

	public renderer(height: number, width: number): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		const dominatingStyleProps = this._series.options();

		this._makeValid();
		const data: PaneRendererDominatingData = {
			items: this._items,
			topLineColor: dominatingStyleProps.topColor,
			topLineStyle: dominatingStyleProps.topLineStyle,
			topLineType: dominatingStyleProps.topLineType,
			topLineWidth: dominatingStyleProps.topLineWidth,
			middleLineColor: dominatingStyleProps.middleColor,
			middleLineStyle: dominatingStyleProps.middleLineStyle,
			middleLineType: dominatingStyleProps.middleLineType,
			middleLineWidth: dominatingStyleProps.middleLineWidth,
			bottomLineColor: dominatingStyleProps.bottomColor,
			bottomLineStyle: dominatingStyleProps.bottomLineStyle,
			bottomLineType: dominatingStyleProps.bottomLineType,
			bottomLineWidth: dominatingStyleProps.bottomLineWidth,
			topBackground: dominatingStyleProps.topBackground,
			bottomBackground: dominatingStyleProps.bottomBackground,
			visibleRange: this._itemsVisibleRange,
			barWidth: this._model.timeScale().barSpacing(),
		};

		this._renderer.setData(data);

		return this._renderer;
	}

	protected _updateOptions(): void {
		this._items.forEach((item: DominatingItem) => {
			const style = this._series.barColorer().barStyle(item.time);
			const options = this._series.options();
			item.topColor = options.topColor;
			item.middleColor = style.barColor || options.middleColor;
			item.bottomColor = options.bottomColor;
			item.topBackground = options.topBackground;
			item.bottomBackground = options.bottomBackground;
		});
	}

	protected _createRawItem(time: TimePointIndex, bar: SeriesPlotRow, colorer: SeriesBarColorer): DominatingItem {
		const style = colorer.barStyle(time);
		const options = this._series.options();
		return {
			...this._createDefaultItem(time, bar),
			topColor: options.topColor,
			middleColor: style.barColor || options.middleColor,
			bottomColor: options.bottomColor,
			topBackground: options.topBackground,
			bottomBackground: options.bottomBackground,
		};
	}
}
