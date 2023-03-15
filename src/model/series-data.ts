import { PlotRow } from './plot-data';
import { PlotList } from './plot-list';
import { SeriesType } from './series-options';

export interface LinePlotRow extends PlotRow {
	readonly color?: string;
	readonly background?: string;
}

export interface DominatingPlotRow extends PlotRow {
	readonly topColor?: string;
	readonly middleColor?: string;
	readonly bottomColor?: string;
	readonly background?: string;
	readonly topBackground?: string;
	readonly bottomBackground?: string;
}

export interface HistogramPlotRow extends PlotRow {
	readonly color?: string;
	readonly background?: string;
}

export interface BarPlotRow extends PlotRow {
	readonly color?: string;
	readonly background?: string;
}

export interface CandlestickPlotRow extends PlotRow {
	readonly color?: string;
	readonly borderColor?: string;
	readonly wickColor?: string;
}

export interface SeriesPlotRowTypeAtTypeMap {
	Bar: BarPlotRow;
	Candlestick: CandlestickPlotRow;
	Area: PlotRow;
	Baseline: PlotRow;
	Line: LinePlotRow;
	Dominating: DominatingPlotRow;
	Histogram: HistogramPlotRow;
}

export type SeriesPlotRow<T extends SeriesType = SeriesType> = SeriesPlotRowTypeAtTypeMap[T];
export type SeriesPlotList<T extends SeriesType = SeriesType> = PlotList<SeriesPlotRow<T>>;

export function createSeriesPlotList<T extends SeriesType = SeriesType>(): SeriesPlotList<T> {
	return new PlotList<SeriesPlotRow<T>>();
}
