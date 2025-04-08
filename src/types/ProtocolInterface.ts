import { JSX } from 'react';

export interface ProtocolInterface {
	renderPoolsContent: () => JSX.Element;
	renderFavPoolsContent: () => JSX.Element;
	favPoolsCount: number;
	poolsCount: number;
}

export interface BasePoolsDisplay {
	totalTvl: number;
	totalFees: number;
}
