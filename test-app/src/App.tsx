import React, { useState, useMemo } from 'react'
import * as Icons from '@kinetic-apps/icons'
import { iconMetadata } from '@kinetic-apps/icons'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVariant, setSelectedVariant] = useState<'all' | 'line' | 'solid'>('all')
  const [iconSize, setIconSize] = useState(24)
  const [iconColor, setIconColor] = useState('currentColor')
  const [currentPage, setCurrentPage] = useState(1)
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)
  const iconsPerPage = 100

  // Get all unique icon names (without variants)
  const allIcons = useMemo(() => {
    const iconMap = new Map<string, any>()
    
    // Process all exports from Icons
    Object.entries(Icons).forEach(([exportName, component]) => {
      if (exportName === 'iconMetadata') return
      
      // Remove variant suffixes to get base name
      let baseName = exportName
        .replace(/1_5$/, '')
        .replace(/Solid$/, '')
        .replace(/Line$/, '')
      
      // Store both line and solid variants if available
      if (!iconMap.has(baseName)) {
        iconMap.set(baseName, {})
      }
      
      if (exportName.includes('1_5') || !exportName.includes('Solid')) {
        iconMap.get(baseName).line = component
      }
      if (exportName.includes('Solid')) {
        iconMap.get(baseName).solid = component
      }
    })
    
    return Array.from(iconMap.entries()).map(([name, variants]) => ({
      name,
      ...variants
    }))
  }, [])

  // Filter icons based on search and variant
  const filteredIcons = useMemo(() => {
    return allIcons.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesVariant = selectedVariant === 'all' || 
        (selectedVariant === 'line' && icon.line) ||
        (selectedVariant === 'solid' && icon.solid)
      return matchesSearch && matchesVariant
    })
  }, [searchTerm, selectedVariant, allIcons])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedVariant])

  // Paginate icons
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * iconsPerPage
    return filteredIcons.slice(startIndex, startIndex + iconsPerPage)
  }, [filteredIcons, currentPage, iconsPerPage])

  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage)

  const renderIcon = (icon: any) => {
    let IconComponent = null
    
    if (selectedVariant === 'line' && icon.line) {
      IconComponent = icon.line
    } else if (selectedVariant === 'solid' && icon.solid) {
      IconComponent = icon.solid
    } else if (selectedVariant === 'all') {
      IconComponent = icon.line || icon.solid
    }
    
    if (!IconComponent) return null
    
    return <IconComponent size={iconSize} color={iconColor} />
  }

  const copyToClipboard = (iconName: string) => {
    const importStatement = `import { ${iconName} } from '@kinetic-apps/icons'`
    navigator.clipboard.writeText(importStatement)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  return (
    <div className="App">
      <h1>Kinetic Icons Gallery</h1>
      <p>{allIcons.length} unique icons • {iconMetadata.length} total variants</p>
      
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              width: '300px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'inherit'
            }}
          />
        </div>
        
        <div className="filters" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label>Variant: </label>
            <select 
              value={selectedVariant} 
              onChange={(e) => setSelectedVariant(e.target.value as any)}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.1)',
                color: 'inherit',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <option value="all">All</option>
              <option value="line">Line Only</option>
              <option value="solid">Solid Only</option>
            </select>
          </div>
          
          <div>
            <label>Size: </label>
            <input
              type="range"
              min="16"
              max="64"
              value={iconSize}
              onChange={(e) => setIconSize(Number(e.target.value))}
            />
            <span> {iconSize}px</span>
          </div>
          
          <div>
            <label>Color: </label>
            <input
              type="color"
              value={iconColor === 'currentColor' ? '#ffffff' : iconColor}
              onChange={(e) => setIconColor(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            <button 
              onClick={() => setIconColor('currentColor')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.1)',
                color: 'inherit',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="results-info" style={{ margin: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Showing {paginatedIcons.length} of {filteredIcons.length} icons</p>
        {totalPages > 1 && (
          <div className="pagination" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : 'inherit',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : 'inherit',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="icon-grid">
        {paginatedIcons.map((icon) => (
          <div 
            key={icon.name} 
            className="icon-item"
            onClick={() => copyToClipboard(icon.name)}
            title={`Click to copy import statement`}
          >
            {renderIcon(icon)}
            <span className="icon-name">{icon.name}</span>
            {copiedIcon === icon.name && (
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>
                Copied!
              </span>
            )}
          </div>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>
          <p>No icons found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}

export default App