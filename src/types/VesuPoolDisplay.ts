import { VesuAssetDisplay } from './VesuAssetDisplay';

export interface VesuPoolDisplay {
	id: string;
	name: string;
	address: string;
	assets: VesuAssetDisplay[];
}
