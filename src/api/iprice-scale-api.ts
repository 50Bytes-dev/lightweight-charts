import { DeepPartial } from '../helpers/strict-type-checks';

import { Coordinate } from '../model/coordinate';
import { PriceScaleOptions } from '../model/price-scale';
import { PriceRange } from '../model/series-options';

/** Interface to control chart's price scale */
export interface IPriceScaleApi {
	/**
	 * Applies new options to the price scale
	 *
	 * @param options - Any subset of options.
	 */
	applyOptions(options: DeepPartial<PriceScaleOptions>): void;

	/**
	 * Returns currently applied options of the price scale
	 *
	 * @returns Full set of currently applied options, including defaults
	 */
	options(): Readonly<PriceScaleOptions>;

	/**
	 * Returns a width of the price scale if it's visible or 0 if invisible.
	 */
	width(): number;

	priceToCoordinate(price: number): Coordinate | null;

	subscribePriceRangeChange(handler: PriceRangeChangeEventHandler): void;
	unsubscribePriceRangeChange(handler: PriceRangeChangeEventHandler): void;
}

export type PriceRangeChangeEventHandler = (priceRange: PriceRange | null) => void;
