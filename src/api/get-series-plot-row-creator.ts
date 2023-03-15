import { PlotRow } from '../model/plot-data';
import { SeriesPlotRow } from '../model/series-data';
import { SeriesType } from '../model/series-options';
import { OriginalTime, TimePoint, TimePointIndex } from '../model/time-data';

import {
	BarData,
	CandlestickData,
	DominatingData,
	HistogramData,
	isWhitespaceData,
	LineData,
	SeriesDataItemTypeMap
} from './data-consumer';

function getLineBasedSeriesPlotRow(time: TimePoint, index: TimePointIndex, item: LineData | HistogramData, originalTime: OriginalTime): Mutable<SeriesPlotRow<'Area' | 'Baseline'>> {
	const val = item.value;
	return { index, time, value: [val, val, val, val], originalTime };
}

function getColoredLineBasedSeriesPlotRow(time: TimePoint, index: TimePointIndex, item: LineData | HistogramData, originalTime: OriginalTime): Mutable<SeriesPlotRow<'Line' | 'Histogram'>> {
	const val = item.value;

	const res: Mutable<SeriesPlotRow<'Line' | 'Histogram'>> = { index, time, value: [val, val, val, val], originalTime };

	// 'color' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('color' in item && item.color !== undefined) {
		res.color = item.color;
	}
	// eslint-disable-next-line no-restricted-syntax
	if ('background' in item && item.background !== undefined) {
		res.background = item.background;
	}

	return res;
}

function getBarSeriesPlotRow(time: TimePoint, index: TimePointIndex, item: BarData, originalTime: OriginalTime): Mutable<SeriesPlotRow<'Bar'>> {
	const res: Mutable<SeriesPlotRow<'Bar'>> = { index, time, value: [item.open, item.high, item.low, item.close], originalTime };

	// 'color' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('color' in item && item.color !== undefined) {
		res.color = item.color;
	}

	return res;
}

function getCandlestickSeriesPlotRow(time: TimePoint, index: TimePointIndex, item: CandlestickData, originalTime: OriginalTime): Mutable<SeriesPlotRow<'Candlestick'>> {
	const res: Mutable<SeriesPlotRow<'Candlestick'>> = { index, time, value: [item.open, item.high, item.low, item.close], originalTime };

	// 'color' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('color' in item && item.color !== undefined) {
		res.color = item.color;
	}

	// 'borderColor' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('borderColor' in item && item.borderColor !== undefined) {
		res.borderColor = item.borderColor;
	}

	// 'wickColor' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('wickColor' in item && item.wickColor !== undefined) {
		res.wickColor = item.wickColor;
	}

	return res;
}

function getDominatingSeriesPlotRow(time: TimePoint, index: TimePointIndex, item: DominatingData, originalTime: OriginalTime): Mutable<SeriesPlotRow<'Dominating'>> {
	const res: Mutable<SeriesPlotRow<'Dominating'>> = { index, time, value: [0, item.high, item.low, item.close], originalTime };

	// 'topColor' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('topColor' in item && item.topColor !== undefined) {
		res.topColor = item.topColor;
	}

	// 'middleColor' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('middleColor' in item && item.middleColor !== undefined) {
		res.middleColor = item.middleColor;
	}

	// 'bottomColor' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('bottomColor' in item && item.bottomColor !== undefined) {
		res.bottomColor = item.bottomColor;
	}

	// 'background' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('background' in item && item.background !== undefined) {
		res.background = item.background;
	}

	// 'topBackground' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('topBackground' in item && item.topBackground !== undefined) {
		res.topBackground = item.topBackground;
	}

	// 'bottomBackground' here is public property (from API) so we can use `in` here safely
	// eslint-disable-next-line no-restricted-syntax
	if ('bottomBackground' in item && item.bottomBackground !== undefined) {
		res.bottomBackground = item.bottomBackground;
	}

	return res;
}

export type WhitespacePlotRow = Omit<PlotRow, 'value'>;

export function isSeriesPlotRow(row: SeriesPlotRow | WhitespacePlotRow): row is SeriesPlotRow {
	return (row as Partial<SeriesPlotRow>).value !== undefined;
}

// we want to have compile-time checks that the type of the functions is correct
// but due contravariance we cannot easily use type of values of the SeriesItemValueFnMap map itself
// so let's use TimedSeriesItemValueFn for shut up the compiler in seriesItemValueFn
// we need to be sure (and we're sure actually) that stored data has correct type for it's according series object
type SeriesItemValueFnMap = {
	[T in keyof SeriesDataItemTypeMap]: (time: TimePoint, index: TimePointIndex, item: SeriesDataItemTypeMap[T], originalTime: OriginalTime) => Mutable<SeriesPlotRow | WhitespacePlotRow>;
};

export type TimedSeriesItemValueFn = (time: TimePoint, index: TimePointIndex, item: SeriesDataItemTypeMap[SeriesType], originalTime: OriginalTime) => Mutable<SeriesPlotRow | WhitespacePlotRow>;

function wrapWhitespaceData(createPlotRowFn: (typeof getLineBasedSeriesPlotRow) | (typeof getBarSeriesPlotRow) | (typeof getCandlestickSeriesPlotRow)): TimedSeriesItemValueFn {
	return (time: TimePoint, index: TimePointIndex, bar: SeriesDataItemTypeMap[SeriesType], originalTime: OriginalTime) => {
		if (isWhitespaceData(bar)) {
			return { time, index, originalTime };
		}

		return createPlotRowFn(time, index, bar, originalTime);
	};
}

const seriesPlotRowFnMap: SeriesItemValueFnMap = {
	Candlestick: wrapWhitespaceData(getCandlestickSeriesPlotRow),
	Bar: wrapWhitespaceData(getBarSeriesPlotRow),
	Area: wrapWhitespaceData(getLineBasedSeriesPlotRow),
	Baseline: wrapWhitespaceData(getLineBasedSeriesPlotRow),
	Histogram: wrapWhitespaceData(getColoredLineBasedSeriesPlotRow),
	Line: wrapWhitespaceData(getColoredLineBasedSeriesPlotRow),
	Dominating: wrapWhitespaceData(getDominatingSeriesPlotRow),
};

export function getSeriesPlotRowCreator(seriesType: SeriesType): TimedSeriesItemValueFn {
	return seriesPlotRowFnMap[seriesType] as TimedSeriesItemValueFn;
}
