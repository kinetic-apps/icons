// Default configuration for icons
export const defaultIconConfig = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 1.5,
};

// Common icon groups for easy discovery
export const iconGroups = {
  navigation: [
    'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
    'chevronLeft', 'chevronRight', 'chevronUp', 'chevronDown',
    'home01', 'menu01', 'close', 'back'
  ],
  communication: [
    'mail01', 'mail02', 'message01', 'chat01',
    'phone01', 'videoCamera01', 'bell01', 'notification01'
  ],
  media: [
    'play', 'pause', 'stop', 'record',
    'skipForward', 'skipBack', 'volume01', 'volumeOff'
  ],
  editor: [
    'bold01', 'italic01', 'underline01', 'strikethrough01',
    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify'
  ],
  social: [
    'heart', 'star01', 'bookmark01', 'share01',
    'thumbsUp', 'thumbsDown', 'comment01', 'user01'
  ],
  common: [
    'search01', 'settings01', 'filter01', 'sort01',
    'edit01', 'trash01', 'download01', 'upload01'
  ]
} as const;