// This file extracts icon names without React dependencies
// Note: This would normally import from components, but since we're using iconList.ts instead
// we'll just re-export from there for compatibility
import { iconNames as iconNamesFromList } from './iconList';

export const iconNames = iconNamesFromList;