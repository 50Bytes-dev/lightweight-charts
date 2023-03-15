import { ChartWidget } from '../gui/chart-widget';

import { ensureNotNull } from '../helpers/assertions';
import { Delegate } from '../helpers/delegate';
import { DeepPartial } from '../helpers/strict-type-checks';

import { Coordinate } from '../model/coordinate';
import { isDefaultPriceScale } from '../model/default-price-scale';
import { PriceRangeImpl } from '../model/price-range-impl';
import { PriceScale, PriceScaleOptions } from '../model/price-scale';
import { PriceRange } from '../model/series-options';

import { IPriceScaleApi, PriceRangeChangeEventHandler } from './iprice-scale-api';

export class PriceScaleApi implements IPriceScaleApi {
	private _chartWidget: ChartWidget;
	private readonly _priceScaleId: string;
	private _priceRangeChanged: Delegate<PriceRange | null> = new Delegate();

	public constructor(chartWidget: ChartWidget, priceScaleId: string) {
		this._chartWidget = chartWidget;
		this._priceScaleId = priceScaleId;

		this._priceScale().onMarksChanged().subscribe(
			this._onMarksChanged.bind(this)
		);
	}

	public applyOptions(options: DeepPartial<PriceScaleOptions>): void {
		this._chartWidget.model().applyPriceScaleOptions(this._priceScaleId, options);
	}

	public options(): Readonly<PriceScaleOptions> {
		return this._priceScale().options();
	}

	public width(): number {
		if (!isDefaultPriceScale(this._priceScaleId)) {
			return 0;
		}

		return this._chartWidget.getPriceAxisWidth(this._priceScaleId);
	}

	public priceToCoordinate(price: number): Coordinate | null {
		const scale = this._priceScale();
		if (!scale) {
			return null;
		}
		return scale.priceToCoordinate(
			price,
			scale.firstValue() || 0
		);
	}

	public subscribePriceRangeChange(handler: PriceRangeChangeEventHandler): void {
		this._priceRangeChanged.subscribe(handler);
	}

	public unsubscribePriceRangeChange(handler: PriceRangeChangeEventHandler): void {
		this._priceRangeChanged.unsubscribe(handler);
	}

	private _priceScale(): PriceScale {
		return ensureNotNull(this._chartWidget.model().findPriceScale(this._priceScaleId)).priceScale;
	}

	private _onMarksChanged(): void {
		if (this._priceRangeChanged.hasListeners()) {
			const range: PriceRangeImpl | null = this._chartWidget.model().findPriceScale(this._priceScaleId)?.priceScale.priceRange() || null;
			if (range) {
				this._priceRangeChanged.fire({
					minValue: range.minValue(),
					maxValue: range.maxValue(),
				});
			} else {
				this._priceRangeChanged.fire(null);
			}
		}
	}
}
