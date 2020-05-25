const chartColor = '#dc3545'; // .text-secondary
const chartColorDNS = '#007bff'; // .text-primary
const chartColorCache = '#17a2b8'; // .text-primary

const fontFamilly = `"Apple SD 산돌고딕 Neo","Apple SD Gothic Neo","나눔 고딕","맑은 고딕","Malgun Gothic","돋움",dotum,sans-serif`;

interface TwimgDetailHttp {
	bps_avg: number;
}
interface TwimgDetail {
	ip: string;
	domain: string;
	default_cdn: boolean;
	http: TwimgDetailHttp;
}

interface JsonData {
	updated_at: string;
	detail: Record<string, TwimgDetail[]>;
}

function bytesToIECSpeed(bytes: number | any): string {
	if (typeof bytes !== 'number') return '0 B';

	if (bytes == 0) return '0 B';
	var sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
	var i = 0;
	while (bytes > 1000 && i++ < 5) {
		bytes /= 1024;
	}
	return Math.floor(bytes * 100) / 100 + ' ' + sizes[i] + '/s';
}

function addToRow(parent: JQuery, elem: Element) {
	let row = document.createElement('div');
	row.className = 'row justify-content-center';

	let col = document.createElement('div');
	col.className = 'col col-md-8';

	col.append(elem);
	row.append(col);
	parent.append(row);
}

interface recordData {
	dns?: number;
	cache?: number;
	default?: number;
}
function drawTable(json: JsonData) {
	let serverDiv = $('#serverDiv');
	let fontSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));

	let chartDataAftDns: number[] = [];
	let chartDataAftCache: number[] = [];
	let chartDataBef: number[] = [];

	let getData = (host: string) => {
		if (!(host in json.detail)) {
			chartDataAftDns.push(0);
			chartDataAftCache.push(0);
			chartDataBef.push(0);
			return;
		}

		let rercod: recordData = {};

		let detail = json.detail[host];
		if (detail) {
			detail.sort((a, b) => a.http.bps_avg + b.http.bps_avg);

			for (var i = 0; i < detail.length; i++) {
				const d = detail[i];

				if (i == 0) rercod.dns = d.http.bps_avg;
				if (d.domain == 'ryuar.in') rercod.cache = d.http.bps_avg;
				if (d.default_cdn) rercod.default = d.http.bps_avg;
			}
		}

		chartDataAftDns.push(rercod.dns || 0);
		chartDataAftCache.push(rercod.cache || 0);
		chartDataBef.push(rercod.default || 0);
	};

	getData('pbs.twimg.com');
	getData('video.twimg.com');

	let chart = <HTMLCanvasElement>document.createElement('canvas');
	addToRow(serverDiv, chart);

	new Chart(chart, {
		type: 'horizontalBar',
		data: {
			datasets: [
				{
					label: '옵션1 적용',
					backgroundColor: [chartColorDNS, chartColorDNS],
					data: chartDataAftDns,
				},
				{
					label: '옵션2 적용',
					backgroundColor: [chartColorCache, chartColorCache],
					data: chartDataAftCache,
				},
				{
					label: '적용 전',
					backgroundColor: [chartColor, chartColor],
					data: chartDataBef,
				},
			],
			labels: ['이미지', '비디오'],
		},
		options: {
			responsive: true,
			aspectRatio: 0.8,
			//aspectRatio: 0.7, // 전체 표시할 때
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 10,
					right: 10,
				},
			},
			animation: {
				duration: 0,
			},
			hover: {
				animationDuration: 0,
			},
			responsiveAnimationDuration: 0,
			legend: {
				display: true,
				position: 'top',
				labels: {
					fontSize: fontSize,
					fontFamily: fontFamilly,
				},
			},
			title: {
				fontSize: fontSize * 1.5,
				fontFamily: fontFamilly,
				display: true,
				text: json.updated_at + ' 기준',
			},
			tooltips: {
				mode: 'nearest',
				xPadding: 10,
				yPadding: 10,
				bodyFontFamily: fontFamilly,
				bodyFontSize: fontSize,
				displayColors: false,
				callbacks: {
					title: () => '',
					label: (tooltipItem) => bytesToIECSpeed(tooltipItem.xLabel),
				},
			},
			scales: {
				yAxes: [
					{
						ticks: {
							fontSize: fontSize,
							fontFamily: fontFamilly,
						},
						gridLines: {
							display: false,
						},
					},
				],
				xAxes: [
					{
						ticks: {
							min: 0,
							stepSize: 256 * 1024,
							maxTicksLimit: 5,
							fontSize: fontSize,
							fontFamily: fontFamilly,
							callback: (value) => bytesToIECSpeed(value),
						},
					},
				],
			},
		},
	});
}
