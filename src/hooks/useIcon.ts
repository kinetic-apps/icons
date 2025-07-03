import { useMemo } from 'react';
import * as Icons from '../components';
import type { IconName } from '../Icon';

export function useIcon(name: IconName, variant?: 'line' | 'solid' | 'auto') {
  return useMemo(() => {
    if (variant === 'solid') {
      const solidName = `${name}Solid` as IconName;
      return Icons[solidName] || Icons[name];
    } else if (variant === 'line') {
      const lineName = `${name}1_5` as IconName;
      return Icons[lineName] || Icons[name];
    } else {
      const lineName = `${name}1_5` as IconName;
      return Icons[lineName] || Icons[name];
    }
  }, [name, variant]);
}