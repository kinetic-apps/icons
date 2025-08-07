import React from 'react';
import { View, Text, ScrollView } from 'react-native';

// Import SVGs directly
import AlertCircle from '../icons/Line/1.5px/alert-circle.svg';
import AlertCircleSolid from '../icons/Solid/alert-circle.svg';
import Activity from '../icons/Line/1.5px/activity.svg';
import ActivitySolid from '../icons/Solid/activity.svg';

export default function DirectSvgTest() {
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Direct SVG Import Test
        </Text>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ marginBottom: 10 }}>Alert Circle (Line):</Text>
          <AlertCircle width={48} height={48} stroke="#000" strokeWidth={1.5} />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ marginBottom: 10 }}>Alert Circle (Solid):</Text>
          <AlertCircleSolid width={48} height={48} fill="#000" />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ marginBottom: 10 }}>Activity (Line):</Text>
          <Activity width={48} height={48} stroke="#ff0000" strokeWidth={2} />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ marginBottom: 10 }}>Activity (Solid):</Text>
          <ActivitySolid width={48} height={48} fill="#ff0000" />
        </View>

        <Text style={{ marginTop: 20, color: '#666' }}>
          These are imported directly from SVG files using react-native-svg-transformer
        </Text>
      </View>
    </ScrollView>
  );
}