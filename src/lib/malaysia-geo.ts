// Approximate center coordinates for Malaysian states
// Used for the family member location map

export const NEGERI_COORDS: Record<string, [number, number]> = {
  'Johor':           [1.4854,  103.7618],
  'Kedah':           [6.1184,  100.3685],
  'Kelantan':        [5.3117,  101.9830],
  'Melaka':          [2.1896,  102.2501],
  'Negeri Sembilan': [2.7258,  101.9424],
  'Pahang':          [3.8126,  103.3256],
  'Perak':           [4.5921,  101.0901],
  'Perlis':          [6.4449,  100.2048],
  'Pulau Pinang':    [5.4164,  100.3327],
  'Sabah':           [5.9788,  116.0753],
  'Sarawak':         [2.5044,  111.0503],
  'Selangor':        [3.0738,  101.5183],
  'Terengganu':      [5.3117,  103.1324],
  'Kuala Lumpur':    [3.1390,  101.6869],
  'Labuan':          [5.2831,  115.2308],
  'Putrajaya':       [2.9264,  101.6964],
}

// Malaysia map bounds for initial view
export const MALAYSIA_CENTER: [number, number] = [4.2105, 108.9758]
export const MALAYSIA_ZOOM = 6
