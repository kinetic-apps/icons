// Example usage of @kineticapps/icons

import React from 'react';
import { Activity, Bell, Heart } from '@kineticapps/icons';
import { ActivityLine15px } from '@kineticapps/icons/line';
import { ActivitySolid } from '@kineticapps/icons/solid';

function IconExamples() {
  return (
    <div>
      {/* Default usage - imports from the main export */}
      <Activity />
      
      {/* With custom props */}
      <Bell size={32} color="#FF5733" strokeWidth={2} />
      
      {/* Different sizes */}
      <Heart size={16} />
      <Heart size={24} />
      <Heart size={48} />
      
      {/* Using specific variants */}
      <ActivityLine15px size={32} color="blue" />
      <ActivitySolid size={32} color="red" />
      
      {/* Inheriting color from CSS */}
      <div style={{ color: 'green' }}>
        <Activity />
      </div>
    </div>
  );
}

export default IconExamples;