import {
	AreaStyleOptions,
	BarStyleOptions,
	BaselineStyleOptions,
	CandlestickStyleOptions, DominatingStyleOptions,
	HistogramStyleOptions,
	LastPriceAnimationMode,
	LineStyleOptions,
	PriceLineSource,
	SeriesOptionsCommon,
} from '../../model/series-options';
import { LineStyle, LineType } from '../../renderers/draw-line';

export const candlestickStyleDefaults: CandlestickStyleOptions = {
	upColor: '#26a69a',
	downColor: '#ef5350',
	wickVisible: true,
	borderVisible: true,
	borderColor: '#378658',
	borderUpColor: '#26a69a',
	borderDownColor: '#ef5350',
	wickColor: '#737375',
	wickUpColor: '#26a69a',
	wickDownColor: '#ef5350',
};

export const barStyleDefaults: BarStyleOptions = {
	upColor: '#26a69a',
	downColor: '#ef5350',
	openVisible: true,
	thinBars: true,
};

export const lineStyleDefaults: LineStyleOptions = {
	color: '#2196f3',
	background: 'transparent',
	lineStyle: LineStyle.Solid,
	lineWidth: 3,
	lineType: LineType.Simple,
	crosshairMarkerVisible: true,
	crosshairMarkerRadius: 4,
	crosshairMarkerBorderColor: '',
	crosshairMarkerBackgroundColor: '',
	lastPriceAnimation: LastPriceAnimationMode.Disabled,
};

export const dominatingStyleDefaults: DominatingStyleOptions = {
	topColor: '#56e35c',
	middleColor: '#2196f3',
	bottomColor: '#e85242',
	background: 'transparent',
	topBackground: 'transparent',
	bottomBackground: 'transparent',
	topLineStyle: LineStyle.Solid,
	topLineWidth: 3,
	topLineType: LineType.Simple,
	middleLineStyle: LineStyle.Solid,
	middleLineWidth: 3,
	middleLineType: LineType.Simple,
	bottomLineStyle: LineStyle.Solid,
	bottomLineWidth: 3,
	bottomLineType: LineType.Simple,
	crosshairMarkerVisible: true,
	crosshairMarkerRadius: 4,
	crosshairMarkerBorderColor: '',
	crosshairMarkerBackgroundColor: '',
	lastPriceAnimation: LastPriceAnimationMode.Disabled,
};

export const areaStyleDefaults: AreaStyleOptions = {
	topColor: 'rgba( 46, 220, 135, 0.4)',
	bottomColor: 'rgba( 40, 221, 100, 0)',
	lineColor: '#33D778',
	lineStyle: LineStyle.Solid,
	lineWidth: 3,
	lineType: LineType.Simple,
	crosshairMarkerVisible: true,
	crosshairMarkerRadius: 4,
	crosshairMarkerBorderColor: '',
	crosshairMarkerBackgroundColor: '',
	lastPriceAnimation: LastPriceAnimationMode.Disabled,
};

export const baselineStyleDefaults: BaselineStyleOptions = {
	baseValue: {
		type: 'price',
		price: 0,
	},

	topFillColor1: 'rgba(38, 166, 154, 0.28)',
	topFillColor2: 'rgba(38, 166, 154, 0.05)',
	topLineColor: 'rgba(38, 166, 154, 1)',

	bottomFillColor1: 'rgba(239, 83, 80, 0.05)',
	bottomFillColor2: 'rgba(239, 83, 80, 0.28)',
	bottomLineColor: 'rgba(239, 83, 80, 1)',

	lineWidth: 3,
	lineStyle: LineStyle.Solid,
	lineType: LineType.Simple,

	crosshairMarkerVisible: true,
	crosshairMarkerRadius: 4,
	crosshairMarkerBorderColor: '',
	crosshairMarkerBackgroundColor: '',

	lastPriceAnimation: LastPriceAnimationMode.Disabled,
};

export const histogramStyleDefaults: HistogramStyleOptions = {
	color: '#26a69a',
	base: 0,
};

export const seriesOptionsDefaults: SeriesOptionsCommon = {
	title: '',
	visible: true,
	lastValueVisible: true,
	priceLineVisible: true,
	priceLineSource: PriceLineSource.LastBar,
	priceLineWidth: 1,
	priceLineColor: '',
	priceLineStyle: LineStyle.Dashed,
	baseLineVisible: true,
	baseLineWidth: 1,
	baseLineColor: '#B2B5BE',
	baseLineStyle: LineStyle.Solid,
	priceFormat: {
		type: 'price',
		precision: 2,
		minMove: 0.01,
	},
};
