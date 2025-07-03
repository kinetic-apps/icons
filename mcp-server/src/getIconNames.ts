// This file extracts icon names without React dependencies
import * as Icons from '../../src/components';

export const iconNames = Object.keys(Icons).filter(key => key !== 'iconMetadata') as string[];