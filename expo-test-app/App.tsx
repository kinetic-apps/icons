import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Icons from '../src/icons-native';

const { width } = Dimensions.get('window');
const ICON_SIZE = (width - 60) / 4; // 4 columns with padding

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<'line' | 'solid'>('line');
  const [iconSize, setIconSize] = useState(24);
  const [iconColor, setIconColor] = useState('#000000');

  // Get all unique icon names (without variants)
  const allIcons = useMemo(() => {
    const iconMap = new Map<string, any>();

    console.log('Total exports:', Object.keys(Icons).length);
    console.log('First 10 exports:', Object.keys(Icons).slice(0, 10));

    Object.entries(Icons).forEach(([exportName, component]) => {
      // Skip non-component exports
      if (exportName === 'Icon' || exportName === 'createKineticIcon' || exportName === 'IconName' || exportName === 'IconSize' || exportName === 'IconProps' || exportName === 'KineticIcon' || exportName === 'KineticIconProps' || exportName === 'IconNode') {
        return;
      }

      // Check if it's a React component (function or ForwardRef)
      if (typeof component !== 'function' && (!component || typeof component !== 'object' || !component.$$typeof)) {
        console.log('Skipping non-component:', exportName, typeof component);
        return;
      }

      // Remove variant suffixes to get base name
      let baseName = exportName
        .replace(/Solid$/, '')
        .replace(/1_5$/, '');

      if (!iconMap.has(baseName)) {
        iconMap.set(baseName, {});
      }

      if (exportName.includes('Solid')) {
        iconMap.get(baseName).solid = component;
      } else {
        iconMap.get(baseName).line = component;
      }
    });

    console.log('Icon map size:', iconMap.size);
    return Array.from(iconMap.entries()).map(([name, variants]) => ({
      name,
      ...variants,
    }));
  }, []);

  // Filter icons based on search and variant
  const filteredIcons = useMemo(() => {
    return allIcons
      .filter((icon) => {
        const matchesSearch = icon.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesVariant =
          (selectedVariant === 'line' && icon.line) ||
          (selectedVariant === 'solid' && icon.solid);
        return matchesSearch && matchesVariant;
      })
      .slice(0, 100); // Limit to 100 for performance
  }, [searchTerm, selectedVariant, allIcons]);

  const renderIcon = (icon: any) => {
    let IconComponent = null;

    if (selectedVariant === 'line' && icon.line) {
      IconComponent = icon.line;
    } else if (selectedVariant === 'solid' && icon.solid) {
      IconComponent = icon.solid;
    }

    if (!IconComponent) return null;

    return <IconComponent size={iconSize} color={iconColor} />;
  };

  const colors = ['#000000', '#FF5733', '#33FF57', '#3357FF', '#FF33F5'];
  const sizes = [16, 24, 32, 48];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>Kinetic Icons</Text>
      <Text style={styles.subtitle}>
        {allIcons.length} icons • {filteredIcons.length} shown
      </Text>

      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search icons..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#999"
        />

        <View style={styles.variantButtons}>
          {(['line', 'solid'] as const).map((variant) => (
            <TouchableOpacity
              key={variant}
              style={[
                styles.variantButton,
                selectedVariant === variant && styles.variantButtonActive,
              ]}
              onPress={() => setSelectedVariant(variant)}
            >
              <Text
                style={[
                  styles.variantButtonText,
                  selectedVariant === variant && styles.variantButtonTextActive,
                ]}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sizeButtons}>
          <Text style={styles.label}>Size:</Text>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                iconSize === size && styles.sizeButtonActive,
              ]}
              onPress={() => setIconSize(size)}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  iconSize === size && styles.sizeButtonTextActive,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.colorButtons}>
          <Text style={styles.label}>Color:</Text>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                iconColor === color && styles.colorButtonActive,
              ]}
              onPress={() => setIconColor(color)}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.iconGrid}
      >
        {filteredIcons.map((icon) => (
          <View key={icon.name} style={styles.iconItem}>
            <View style={styles.iconWrapper}>{renderIcon(icon)}</View>
            <Text style={styles.iconName} numberOfLines={1}>
              {icon.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  controls: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  variantButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  variantButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  variantButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  variantButtonText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  variantButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sizeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    marginRight: 10,
    fontSize: 14,
    color: '#666',
  },
  sizeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sizeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  sizeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  colorButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  colorButtonActive: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  scrollView: {
    flex: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  iconItem: {
    width: ICON_SIZE,
    alignItems: 'center',
    marginBottom: 20,
    padding: 5,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconName: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    width: '100%',
  },
});