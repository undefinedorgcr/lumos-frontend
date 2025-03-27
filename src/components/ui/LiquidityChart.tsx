/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Token } from '@/types/Tokens';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} from 'recharts';

interface LiquidityData {
	tick: number;
	liquidity_net: string;
}

interface LiquidityChartProps {
	liquidityData: LiquidityData[];
	minPrice: number;
	maxPrice: number;
	currentPrice: number;
	token0: Token;
	token1: Token;
}

export default function LiquidityChart({
	liquidityData,
	minPrice,
	maxPrice,
	currentPrice,
	token0,
	token1,
}: LiquidityChartProps) {
	const baseData =
		liquidityData.length > 0
			? liquidityData.map(({ tick, liquidity_net }) => ({
					tick,
					liquidity: parseFloat(liquidity_net),
				}))
			: [];

	const formattedData = [...baseData];

	formattedData.sort((a, b) => a.tick - b.tick);

	const maxLiquidity = Math.max(
		...formattedData.map((item) => Math.abs(item.liquidity))
	);

	const normalizedData = formattedData.map((item) => {
		const liquidityValue = isNaN(item.liquidity) ? 0 : item.liquidity;
		const absLiquidity = Math.abs(liquidityValue);

		const normalizedValue =
			Math.sqrt(absLiquidity) /
			(maxLiquidity > 0 ? Math.sqrt(maxLiquidity) : 1);

		return {
			...item,
			normalizedLiquidity:
				liquidityValue >= 0 ? normalizedValue : -normalizedValue,
			originalLiquidity: liquidityValue,
		};
	});

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const tick = payload[0].payload.tick;
			return (
				<div className="p-2 bg-zinc-800 border border-zinc-700 text-white rounded-md text-sm shadow-lg">
					<p className="font-medium">{`Price: ${typeof tick === 'number' ? tick : tick}`}</p>
					<p className="text-zinc-400">{`${token1.symbol} per ${token0.symbol}`}</p>
				</div>
			);
		}
		return null;
	};

	// Modificar el dominio para incluir minPrice, maxPrice y currentPrice
	let xDomain: [number, number] = [0, 1];

	if (formattedData.length > 0) {
		const allTicks = formattedData.map((d) => d.tick);

		// Incluir minPrice, maxPrice y currentPrice en el cálculo del dominio
		const minTick = Math.min(...allTicks, minPrice);
		const maxTick = Math.max(...allTicks, maxPrice);

		// Asegurarse de que currentPrice está dentro del rango visible
		const domainMin = Math.min(minTick, currentPrice) * 0.95;
		const domainMax = Math.max(maxTick, currentPrice) * 1.05;

		xDomain = [domainMin, domainMax];
	} else {
		// Si no hay datos, asegurarse de que al menos se muestren las líneas de referencia
		const buffer = Math.max(maxPrice - minPrice, 1) * 0.2;
		xDomain = [minPrice - buffer, maxPrice + buffer];
	}

	// Verificar que los valores son válidos
	const validMinPrice = isNaN(minPrice) ? 0 : minPrice;
	const validMaxPrice = isNaN(maxPrice) ? 1 : maxPrice;
	const validCurrentPrice = isNaN(currentPrice) ? 0.5 : currentPrice;

	return (
		<div className="bg-zinc-800/50 rounded-lg flex flex-col h-full">
			<div className="flex items-center justify-between p-4 border-b border-zinc-700">
				<h2 className="text-sm font-medium">Liquidity Distribution</h2>
				<div className="flex items-center space-x-4 text-xs">
					<div className="flex items-center space-x-1">
						<div className="w-3 h-3 bg-green-500 rounded-full"></div>
						<span className="text-zinc-400">Price Range</span>
					</div>
					<div className="flex items-center space-x-1">
						<div className="w-3 h-3 bg-pink-500 rounded-full"></div>
						<span className="text-zinc-400">Current Price</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col h-full p-4">
				<div className="flex-1">
					<ResponsiveContainer
						width="100%"
						height="100%"
						minHeight={250}
					>
						<BarChart
							data={normalizedData}
							margin={{ top: 30, right: 10, left: 10, bottom: 5 }}
						>
							<XAxis
								dataKey="tick"
								domain={xDomain}
								type="number"
								scale="linear"
								tick={{ fill: '#a1a1aa', fontSize: 11 }}
								tickFormatter={(value) =>
									typeof value === 'number'
										? value.toFixed(2)
										: String(value)
								}
								axisLine={{ stroke: '#3f3f46' }}
								tickLine={{ stroke: '#3f3f46' }}
								allowDataOverflow={true}
								height={30}
							/>
							<YAxis hide={true} />
							<Tooltip
								content={<CustomTooltip />}
								cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
							/>
							<Bar dataKey="normalizedLiquidity" fill="#3b82f6" />

							<ReferenceLine
								x={validMinPrice}
								stroke="#22c55e"
								strokeWidth={2}
								strokeDasharray="3 3"
								label={{
									value: 'Min',
									position: 'insideTopLeft',
									fill: '#22c55e',
									fontSize: 11,
									offset: 10,
								}}
								isFront={true}
							/>

							<ReferenceLine
								x={validMaxPrice}
								stroke="#22c55e"
								strokeWidth={2}
								strokeDasharray="3 3"
								label={{
									value: 'Max',
									position: 'insideTopRight',
									fill: '#22c55e',
									fontSize: 11,
									offset: 10,
								}}
								isFront={true}
							/>

							<ReferenceLine
								x={validCurrentPrice}
								stroke="#ec4899"
								strokeWidth={2}
								label={{
									value: 'Current',
									position: 'insideTop',
									fill: '#ec4899',
									fontSize: 11,
									offset: 10,
								}}
								isFront={true}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className="grid grid-cols-3 gap-4 mt-4">
					<div className="bg-zinc-800 rounded p-2">
						<p className="text-xs text-zinc-400">Min Price</p>
						<p className="text-sm font-medium">
							{typeof validMinPrice === 'number'
								? validMinPrice.toFixed(6)
								: validMinPrice}
						</p>
						<p className="text-xs text-zinc-500">
							{token1.symbol} per {token0.symbol}
						</p>
					</div>
					<div className="bg-zinc-800 rounded p-2 border border-pink-500/30">
						<p className="text-xs text-zinc-400">Current Price</p>
						<p className="text-sm font-medium text-pink-400">
							{typeof validCurrentPrice === 'number'
								? validCurrentPrice.toFixed(6)
								: validCurrentPrice}
						</p>
						<p className="text-xs text-zinc-500">
							{token1.symbol} per {token0.symbol}
						</p>
					</div>
					<div className="bg-zinc-800 rounded p-2">
						<p className="text-xs text-zinc-400">Max Price</p>
						<p className="text-sm font-medium">
							{typeof validMaxPrice === 'number'
								? validMaxPrice.toFixed(6)
								: validMaxPrice}
						</p>
						<p className="text-xs text-zinc-500">
							{token1.symbol} per {token0.symbol}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
