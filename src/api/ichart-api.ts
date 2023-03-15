import { DeepPartial } from '../helpers/strict-type-checks';

import { ChartOptions } from '../model/chart-model';
import { Point } from '../model/point';
import { SeriesMarker } from '../model/series-markers';
import {
	AreaSeriesPartialOptions,
	BarSeriesPartialOptions,
	BaselineSeriesPartialOptions,
	CandlestickSeriesPartialOptions, DominatingSeriesPartialOptions,
	HistogramSeriesPartialOptions,
	LineSeriesPartialOptions,
	SeriesType,
} from '../model/series-options';
import { Logical, Time } from '../model/time-data';

import { BarData, HistogramData, LineData } from './data-consumer';
import { IPriceScaleApi } from './iprice-scale-api';
import { ISeriesApi } from './iseries-api';
import { ITimeScaleApi } from './itime-scale-api';

/**
 * Represents a mouse event.
 */
export interface MouseEventParams {
	/**
	 * Time of the data at the location of the mouse event.
	 *
	 * The value will be `undefined` if the location of the event in the chart is outside the range of available data.
	 */
	time?: Time;
	/**
	 * Logical index
	 */
	logical?: Logical;
	/**
	 * Location of the event in the chart.
	 *
	 * The value will be `undefined` if the event is fired outside the chart, for example a mouse leave event.
	 */
	point?: Point;
	/**
	 * The index of the Pane
	 */
	paneIndex?: number;
	/**
	 * Data of all series at the location of the event in the chart.
	 *
	 * Keys of the map are {@link ISeriesApi} instances. Values are prices.
	 * Values of the map are original data items
	 */
	seriesData: Map<ISeriesApi<SeriesType>, BarData | LineData | HistogramData>;
	/**
	 * The {@link ISeriesApi} for the series at the point of the mouse event.
	 */
	hoveredSeries?: ISeriesApi<SeriesType>;
	/**
	 * The ID of the marker at the point of the mouse event.
	 */
	hoveredMarkerId?: SeriesMarker<Time>['id'];
}

/**
 * A custom function use to handle mouse events.
 */
export type MouseEventHandler = (param: MouseEventParams) => void;

export interface PaneEventParams {
	top: {
		index: number;
		height: number;
	};
	bottom: {
		index: number;
		height: number;
	};
}

export type PaneEventHandler = (param: PaneEventParams) => void;

export interface ISize {
	width: number;
	height: number;
}

/**
 * The main interface of a single chart.
 */
export interface IChartApi {
	/**
	 * Removes the chart object including all DOM elements. This is an irreversible operation, you cannot do anything with the chart after removing it.
	 */
	remove(): void;

	/**
	 * Sets fixed size of the chart. By default chart takes up 100% of its container.
	 *
	 * @param width - Target width of the chart.
	 * @param height - Target height of the chart.
	 * @param forceRepaint - True to initiate resize immediately. One could need this to get screenshot immediately after resize.
	 */
	resize(width: number, height: number, forceRepaint?: boolean): void;

	/**
	 * Creates an area series with specified parameters.
	 *
	 * @param areaOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addAreaSeries();
	 * ```
	 */
	addAreaSeries(areaOptions?: AreaSeriesPartialOptions): ISeriesApi<'Area'>;

	/**
	 * Creates a baseline series with specified parameters.
	 *
	 * @param baselineOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addBaselineSeries();
	 * ```
	 */
	addBaselineSeries(baselineOptions?: BaselineSeriesPartialOptions): ISeriesApi<'Baseline'>;

	/**
	 * Creates a bar series with specified parameters.
	 *
	 * @param barOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addBarSeries();
	 * ```
	 */
	addBarSeries(barOptions?: BarSeriesPartialOptions): ISeriesApi<'Bar'>;

	/**
	 * Creates a candlestick series with specified parameters.
	 *
	 * @param candlestickOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addCandlestickSeries();
	 * ```
	 */
	addCandlestickSeries(candlestickOptions?: CandlestickSeriesPartialOptions): ISeriesApi<'Candlestick'>;

	/**
	 * Creates a histogram series with specified parameters.
	 *
	 * @param histogramOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addHistogramSeries();
	 * ```
	 */
	addHistogramSeries(histogramOptions?: HistogramSeriesPartialOptions): ISeriesApi<'Histogram'>;

	/**
	 * Creates a line series with specified parameters.
	 *
	 * @param lineOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addLineSeries();
	 * ```
	 */
	addLineSeries(lineOptions?: LineSeriesPartialOptions): ISeriesApi<'Line'>;

	/**
	 * Creates a line series with specified parameters.
	 *
	 * @param dominatingOptions - Customization parameters of the series being created.
	 * @returns An interface of the created series.
	 * @example
	 * ```js
	 * const series = chart.addDominatingSeries();
	 * ```
	 */
	addDominatingSeries(dominatingOptions?: DominatingSeriesPartialOptions): ISeriesApi<'Dominating'>;

	/**
	 * Removes a series of any type. This is an irreversible operation, you cannot do anything with the series after removing it.
	 *
	 * @example
	 * ```js
	 * chart.removeSeries(series);
	 * ```
	 */
	removeSeries(seriesApi: ISeriesApi<SeriesType>): void;

	/**
	 * Subscribe to the chart click event.
	 *
	 * @param handler - Handler to be called on mouse click.
	 * @example
	 * ```js
	 * function myClickHandler(param) {
	 *     if (!param.point) {
	 *         return;
	 *     }
	 *
	 *     console.log(`Click at ${param.point.x}, ${param.point.y}. The time is ${param.time}.`);
	 * }
	 *
	 * chart.subscribeClick(myClickHandler);
	 * ```
	 */
	subscribeClick(handler: MouseEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeClick}.
	 *
	 * @param handler - Previously subscribed handler
	 * @example
	 * ```js
	 * chart.unsubscribeClick(myClickHandler);
	 * ```
	 */
	unsubscribeClick(handler: MouseEventHandler): void;

	/**
	 * Subscribe to the chart mousedown event.
	 *
	 * @param handler - Previously subscribed handler
	 */
	subscribeMouseDown(handler: MouseEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeMouseDown}.
	 *
	 * @param handler - Previously subscribed handler
	 */
	unsubscribeMouseDown(handler: MouseEventHandler): void;

	/**
	 * Subscribe to the chart mouseup event.
	 *
	 * @param handler - Previously subscribed handler
	 */
	subscribeMouseUp(handler: MouseEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeMouseUp}.
	 *
	 * @param handler - Previously subscribed handler
	 */
	unsubscribeMouseUp(handler: MouseEventHandler): void;

	/**
	 * Subscribe to the crosshair move event.
	 *
	 * @param handler - Handler to be called on crosshair move.
	 * @example
	 * ```js
	 * function myCrosshairMoveHandler(param) {
	 *     if (!param.point) {
	 *         return;
	 *     }
	 *
	 *     console.log(`Crosshair moved to ${param.point.x}, ${param.point.y}. The time is ${param.time}.`);
	 * }
	 *
	 * chart.subscribeClick(myCrosshairMoveHandler);
	 * ```
	 */
	subscribeCrosshairMove(handler: MouseEventHandler): void;

	/**
	 * Unsubscribe a handler that was previously subscribed using {@link subscribeCrosshairMove}.
	 *
	 * @param handler - Previously subscribed handler
	 * @example
	 * ```js
	 * chart.unsubscribeCrosshairMove(myCrosshairMoveHandler);
	 * ```
	 */
	unsubscribeCrosshairMove(handler: MouseEventHandler): void;

	/**
	 * Returns API to manipulate a price scale.
	 *
	 * @param priceScaleId - ID of the price scale.
	 * @returns Price scale API.
	 */
	priceScale(priceScaleId: string): IPriceScaleApi;

	/**
	 * Returns API to manipulate the time scale
	 *
	 * @returns Target API
	 */
	timeScale(): ITimeScaleApi;

	/**
	 * Applies new options to the chart
	 *
	 * @param options - Any subset of options.
	 */
	applyOptions(options: DeepPartial<ChartOptions>): void;

	/**
	 * Returns currently applied options
	 *
	 * @returns Full set of currently applied options, including defaults
	 */
	options(): Readonly<ChartOptions>;

	/**
	 * Make a screenshot of the chart with all the elements excluding crosshair.
	 *
	 * @returns A canvas with the chart drawn on. Any `Canvas` methods like `toDataURL()` or `toBlob()` can be used to serialize the result.
	 */
	takeScreenshot(): HTMLCanvasElement;

	/**
	 * Adds a subscription to pane resize event
	 *
	 * @param handler - handler (function) to be called on pane resize
	 */
	subscribePaneResize(handler: PaneEventHandler): void;

	/**
	 * Removes pane resize subscription
	 *
	 * @param handler - previously subscribed handler
	 */
	unsubscribePaneResize(handler: PaneEventHandler): void;

	/**
	 * Removes a pane with index
	 *
	 * @param index - the pane to be removed
	 */
	removePane(index: number): void;

	/**
	 * swap the position of two panes.
	 *
	 * @param first - the first index
	 * @param second - the second index
	 */
	swapPane(first: number, second: number): void;

	getPaneElements(): HTMLElement[];

	setPaneHeight(index: number, height: number): void;

	setPaneSize(index: number, width: number, height: number): void;

	getPaneSize(index: number): ISize;

	setPaneSeparator(height: number): void;
}
