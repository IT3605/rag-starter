export interface BusArrival {
  time: string; // e.g. "Arr", "2 min", "6 min", "14 min"
  load: 'seats' | 'standing' | 'crowded'; // green, amber, red
  type?: 'Single Deck' | 'Double Decker' | 'Bendy';
  wab?: boolean;
}

export interface Telematics {
  busPlate: string;
  model: string;
  isElectric: boolean;
  deckType: 'Single Deck' | 'Double Decker' | 'Bendy';
  isWab: boolean;
  distanceKm: number;
  stage: string;
  adultFare: string;
  concessionFare: string;
  co2SavedKg: string;
}

export interface BusStop {
  id: number;
  code: string;
  name: string;
  road: string;
  isTerminal?: boolean;
  mrtBadges?: { code: string; bg: string; text: string }[];
  focusedNote?: string;
  arrivals: BusArrival[];
  telematics?: Telematics;
  mapCoords: { x: number; y: number }; // percentage on map
}

export interface Direction {
  id: 1 | 2;
  title: string;
  subtitle: string;
  stops: BusStop[];
}

export interface Timetable {
  weekdayHours: string;
  weekdayHeadway: string;
  satHours: string;
  satHeadway: string;
  sunHours: string;
  sunHeadway: string;
}

export interface BusService {
  serviceNo: string;
  category: 'TRUNK' | 'FEEDER' | 'EXPRESS';
  origin: string;
  destination: string;
  wab: boolean;
  electricFleet: boolean;
  totalDistance: string;
  totalStops: number;
  timetable: Timetable;
  directions: [Direction, Direction];
  activeBuses: {
    plate: string;
    stopId: number;
    coords: { x: number; y: number };
    status: string;
    load: 'seats' | 'standing' | 'crowded';
    speed: string;
  }[];
}

export const BUS_SERVICES: Record<string, BusService> = {
  '147': {
    serviceNo: '147',
    category: 'TRUNK',
    origin: 'Hougang Central Int',
    destination: 'Clementi Int',
    wab: true,
    electricFleet: true,
    totalDistance: '28.3 km (68 Stops)',
    totalStops: 68,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '6 - 10 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '8 - 12 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 15 mins',
    },
    activeBuses: [
      { plate: 'SBS3288K', stopId: 6, coords: { x: 34, y: 32 }, status: 'To Clementi • Seats Avail', load: 'seats', speed: '26 km/h' },
      { plate: 'SBS6712B', stopId: 8, coords: { x: 67, y: 48 }, status: 'To Clementi • Standing Avail', load: 'standing', speed: '22 km/h' },
      { plate: 'SBS3921T', stopId: 2, coords: { x: 22, y: 18 }, status: 'Approaching Blk 831', load: 'seats', speed: '28 km/h' },
      { plate: 'SBS8842L', stopId: 10, coords: { x: 80, y: 64 }, status: 'Towards Woodleigh', load: 'crowded', speed: '19 km/h' },
    ],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Clementi Int',
        subtitle: 'Via Serangoon, Victoria St, Chinatown, Queensway',
        stops: [
          {
            id: 1,
            code: '64009',
            name: 'Hougang Central Int',
            road: 'Hougang Central',
            isTerminal: true,
            arrivals: [],
            telematics: {
              busPlate: 'SBS3921T',
              model: 'Volvo B9TL Wright Double Deck',
              isElectric: false,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 0.0,
              stage: 'Stage 1.0 (Depot Berth 4)',
              adultFare: '$0.00',
              concessionFare: '$0.00',
              co2SavedKg: '0.0',
            },
            mapCoords: { x: 20, y: 16 },
          },
          {
            id: 2,
            code: '64391',
            name: 'Opp Blk 831',
            road: 'Hougang Central',
            arrivals: [
              { time: 'Arr', load: 'seats', type: 'Double Decker', wab: true },
              { time: '7 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '16 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS3921T',
              model: 'Volvo B9TL Wright DD',
              isElectric: false,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 0.7,
              stage: 'Stage 1.5',
              adultFare: '$1.09',
              concessionFare: '$0.48',
              co2SavedKg: '0.4',
            },
            mapCoords: { x: 23, y: 22 },
          },
          {
            id: 3,
            code: '64381',
            name: 'Blk 834',
            road: 'Hougang Ave 10',
            arrivals: [
              { time: '2 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '9 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS3201P',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 1.3,
              stage: 'Stage 2.5',
              adultFare: '$1.09',
              concessionFare: '$0.48',
              co2SavedKg: '0.8',
            },
            mapCoords: { x: 27, y: 26 },
          },
          {
            id: 4,
            code: '64041',
            name: 'Opp Hougang Plaza',
            road: 'Upper Serangoon Rd',
            arrivals: [
              { time: '4 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '12 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS3288K',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 2.1,
              stage: 'Stage 4.0',
              adultFare: '$1.19',
              concessionFare: '$0.55',
              co2SavedKg: '1.2',
            },
            mapCoords: { x: 30, y: 29 },
          },
          {
            id: 5,
            code: '63271',
            name: 'Blk 248',
            road: 'Upper Serangoon Rd',
            arrivals: [
              { time: '8 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '18 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS3288K',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 2.7,
              stage: 'Stage 5.0',
              adultFare: '$1.19',
              concessionFare: '$0.55',
              co2SavedKg: '1.6',
            },
            mapCoords: { x: 33, y: 31 },
          },
          {
            id: 6,
            code: '63039',
            name: 'Kovan Stn Exit C',
            road: 'Upper Serangoon Rd',
            focusedNote: 'Focused Stop',
            mrtBadges: [{ code: 'NEL Interchange', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [
              { time: '3 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '11 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '22 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS3288K',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 3.4,
              stage: 'Stage 6.5 from Hougang Int',
              adultFare: '$1.29',
              concessionFare: '$0.65',
              co2SavedKg: '2.1',
            },
            mapCoords: { x: 42, y: 34 },
          },
          {
            id: 7,
            code: '63029',
            name: 'The Helping Hand',
            road: 'Upper Serangoon Rd',
            arrivals: [
              { time: '6 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '14 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS6712B',
              model: 'Mercedes-Benz Citaro Single Deck',
              isElectric: false,
              deckType: 'Single Deck',
              isWab: true,
              distanceKm: 4.1,
              stage: 'Stage 7.5',
              adultFare: '$1.29',
              concessionFare: '$0.65',
              co2SavedKg: '2.4',
            },
            mapCoords: { x: 48, y: 38 },
          },
          {
            id: 8,
            code: '63019',
            name: 'Opp Serangoon Sports Cplx',
            road: 'Upper Serangoon Rd',
            arrivals: [
              { time: '10 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '19 min', load: 'crowded', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS6712B',
              model: 'Mercedes-Benz Citaro Single Deck',
              isElectric: false,
              deckType: 'Single Deck',
              isWab: true,
              distanceKm: 4.8,
              stage: 'Stage 8.5',
              adultFare: '$1.39',
              concessionFare: '$0.70',
              co2SavedKg: '2.9',
            },
            mapCoords: { x: 55, y: 44 },
          },
          {
            id: 9,
            code: '66359',
            name: 'Serangoon Stn Exit C / Nex',
            road: 'Serangoon Central',
            mrtBadges: [
              { code: 'NE12', bg: '#8A31BC', text: '#ffffff' },
              { code: 'CC13', bg: '#FFAA00', text: '#000000' },
            ],
            arrivals: [
              { time: '13 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '22 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS3288K',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 5.6,
              stage: 'Stage 10.0',
              adultFare: '$1.49',
              concessionFare: '$0.75',
              co2SavedKg: '3.4',
            },
            mapCoords: { x: 62, y: 50 },
          },
          {
            id: 10,
            code: '66031',
            name: 'Woodleigh Stn',
            road: 'Upper Serangoon Rd',
            mrtBadges: [{ code: 'NE11', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [
              { time: '17 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '26 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS8842L',
              model: 'Volvo B9TL Wright DD',
              isElectric: false,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 6.7,
              stage: 'Stage 12.0',
              adultFare: '$1.59',
              concessionFare: '$0.80',
              co2SavedKg: '4.0',
            },
            mapCoords: { x: 68, y: 56 },
          },
          // Extended stops when expanding all stops
          {
            id: 11,
            code: '60111',
            name: 'Potong Pasir Stn Exit B',
            road: 'Upper Serangoon Rd',
            mrtBadges: [{ code: 'NE10', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [
              { time: '21 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '31 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 70, y: 60 },
          },
          {
            id: 12,
            code: '60081',
            name: 'Boon Keng Stn / Blk 102',
            road: 'Serangoon Rd',
            mrtBadges: [{ code: 'NE9', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [
              { time: '25 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '36 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 72, y: 64 },
          },
          {
            id: 13,
            code: '01419',
            name: 'Bugis Stn / Victoria St',
            road: 'Victoria St',
            mrtBadges: [
              { code: 'EW12', bg: '#009640', text: '#ffffff' },
              { code: 'DT14', bg: '#005EC4', text: '#ffffff' },
            ],
            arrivals: [
              { time: '32 min', load: 'crowded', type: 'Double Decker', wab: true },
              { time: '43 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 74, y: 70 },
          },
          {
            id: 14,
            code: '04121',
            name: 'Clarke Quay Stn / Central',
            road: 'Eu Tong Sen St',
            mrtBadges: [{ code: 'NE5', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [
              { time: '39 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '50 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 69, y: 74 },
          },
          {
            id: 15,
            code: '05013',
            name: 'Chinatown Stn Exit E',
            road: 'Eu Tong Sen St',
            mrtBadges: [
              { code: 'NE4', bg: '#8A31BC', text: '#ffffff' },
              { code: 'DT19', bg: '#005EC4', text: '#ffffff' },
            ],
            arrivals: [
              { time: '44 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '54 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 65, y: 78 },
          },
          {
            id: 16,
            code: '11019',
            name: 'Queensway Shopping Ctr',
            road: 'Queensway',
            arrivals: [
              { time: '51 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '62 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 50, y: 82 },
          },
          {
            id: 17,
            code: '17179',
            name: 'Clementi Int',
            road: 'Clementi Ave 3',
            isTerminal: true,
            mrtBadges: [{ code: 'EW23', bg: '#009640', text: '#ffffff' }],
            arrivals: [],
            telematics: {
              busPlate: 'SBS3288K',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 28.3,
              stage: 'Stage 56.5 (Terminal Arrival)',
              adultFare: '$2.19',
              concessionFare: '$1.10',
              co2SavedKg: '16.8',
            },
            mapCoords: { x: 30, y: 85 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Hougang Central Int',
        subtitle: 'Via Commonwealth, Bras Basah, Upper Serangoon',
        stops: [
          {
            id: 101,
            code: '17179',
            name: 'Clementi Int',
            road: 'Clementi Ave 3',
            isTerminal: true,
            mrtBadges: [{ code: 'EW23', bg: '#009640', text: '#ffffff' }],
            arrivals: [],
            telematics: {
              busPlate: 'SBS3108T',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 0.0,
              stage: 'Stage 1.0 (Clementi Berth 2)',
              adultFare: '$0.00',
              concessionFare: '$0.00',
              co2SavedKg: '0.0',
            },
            mapCoords: { x: 30, y: 85 },
          },
          {
            id: 102,
            code: '17091',
            name: 'Blk 328 Clementi Ave 2',
            road: 'Commonwealth Ave West',
            arrivals: [
              { time: 'Arr', load: 'seats', type: 'Double Decker', wab: true },
              { time: '8 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 35, y: 82 },
          },
          {
            id: 103,
            code: '11011',
            name: 'Opp Queensway Shopping Ctr',
            road: 'Queensway',
            arrivals: [
              { time: '6 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '14 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 50, y: 80 },
          },
          {
            id: 104,
            code: '05019',
            name: 'Chinatown Point',
            road: 'New Bridge Rd',
            mrtBadges: [
              { code: 'NE4', bg: '#8A31BC', text: '#ffffff' },
              { code: 'DT19', bg: '#005EC4', text: '#ffffff' },
            ],
            arrivals: [
              { time: '12 min', load: 'crowded', type: 'Double Decker', wab: true },
              { time: '21 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 65, y: 76 },
          },
          {
            id: 105,
            code: '01012',
            name: 'Hotel Rendezvous / Bras Basah',
            road: 'Bras Basah Rd',
            mrtBadges: [{ code: 'CC2', bg: '#FFAA00', text: '#000000' }],
            arrivals: [
              { time: '19 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '27 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 70, y: 68 },
          },
          {
            id: 106,
            code: '66351',
            name: 'Opp Nex / Serangoon Stn',
            road: 'Serangoon Central',
            mrtBadges: [
              { code: 'NE12', bg: '#8A31BC', text: '#ffffff' },
              { code: 'CC13', bg: '#FFAA00', text: '#000000' },
            ],
            arrivals: [
              { time: '26 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '34 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 62, y: 48 },
          },
          {
            id: 107,
            code: '63031',
            name: 'Kovan Stn Exit B',
            road: 'Upper Serangoon Rd',
            mrtBadges: [{ code: 'NEL Interchange', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [
              { time: '31 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '39 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 42, y: 32 },
          },
          {
            id: 108,
            code: '64009',
            name: 'Hougang Central Int',
            road: 'Hougang Central',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 20, y: 16 },
          },
        ],
      },
    ],
  },
  '65': {
    serviceNo: '65',
    category: 'TRUNK',
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    wab: true,
    electricFleet: true,
    totalDistance: '24.1 km (58 Stops)',
    totalStops: 58,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '7 - 11 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '9 - 13 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 15 mins',
    },
    activeBuses: [
      { plate: 'SBS6501R', stopId: 1, coords: { x: 82, y: 28 }, status: 'Tampines to HarbourFront', load: 'seats', speed: '24 km/h' },
      { plate: 'SBS6599H', stopId: 4, coords: { x: 50, y: 55 }, status: 'Towards Orchard', load: 'standing', speed: '21 km/h' },
    ],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards HarbourFront Int',
        subtitle: 'Via Tampines Ave 4, Bedok Reservoir, MacPherson, Orchard, Lower Delta',
        stops: [
          {
            id: 1,
            code: '75009',
            name: 'Tampines Int',
            road: 'Tampines Central 1',
            isTerminal: true,
            mrtBadges: [
              { code: 'EW2', bg: '#009640', text: '#ffffff' },
              { code: 'DT32', bg: '#005EC4', text: '#ffffff' },
            ],
            arrivals: [],
            telematics: {
              busPlate: 'SBS6501R',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 0.0,
              stage: 'Stage 1.0',
              adultFare: '$0.00',
              concessionFare: '$0.00',
              co2SavedKg: '0.0',
            },
            mapCoords: { x: 84, y: 26 },
          },
          {
            id: 2,
            code: '76191',
            name: 'Tampines West Stn Exit B',
            road: 'Tampines Ave 4',
            mrtBadges: [{ code: 'DT31', bg: '#005EC4', text: '#ffffff' }],
            arrivals: [
              { time: 'Arr', load: 'seats', type: 'Double Decker', wab: true },
              { time: '8 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 78, y: 32 },
          },
          {
            id: 3,
            code: '72059',
            name: 'Bedok Reservoir Stn',
            road: 'Bedok Reservoir Rd',
            mrtBadges: [{ code: 'DT30', bg: '#005EC4', text: '#ffffff' }],
            arrivals: [
              { time: '5 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '14 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 70, y: 40 },
          },
          {
            id: 4,
            code: '70109',
            name: 'MacPherson Stn Exit A',
            road: 'Paya Lebar Rd',
            mrtBadges: [
              { code: 'CC10', bg: '#FFAA00', text: '#000000' },
              { code: 'DT26', bg: '#005EC4', text: '#ffffff' },
            ],
            focusedNote: 'Focused Stop',
            arrivals: [
              { time: '3 min', load: 'standing', type: 'Double Decker', wab: true },
              { time: '12 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            telematics: {
              busPlate: 'SBS6599H',
              model: 'Volvo BZL Electric DD',
              isElectric: true,
              deckType: 'Double Decker',
              isWab: true,
              distanceKm: 8.4,
              stage: 'Stage 16.0',
              adultFare: '$1.69',
              concessionFare: '$0.85',
              co2SavedKg: '5.2',
            },
            mapCoords: { x: 55, y: 52 },
          },
          {
            id: 5,
            code: '09048',
            name: 'Orchard Stn / Lucky Plaza',
            road: 'Orchard Rd',
            mrtBadges: [
              { code: 'NS22', bg: '#D42E12', text: '#ffffff' },
              { code: 'TE14', bg: '#9D5B25', text: '#ffffff' },
            ],
            arrivals: [
              { time: '18 min', load: 'crowded', type: 'Double Decker', wab: true },
              { time: '29 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 42, y: 65 },
          },
          {
            id: 6,
            code: '14141',
            name: 'HarbourFront Int',
            road: 'Seah Im Rd',
            isTerminal: true,
            mrtBadges: [
              { code: 'NE1', bg: '#8A31BC', text: '#ffffff' },
              { code: 'CC29', bg: '#FFAA00', text: '#000000' },
            ],
            arrivals: [],
            mapCoords: { x: 38, y: 88 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Tampines Int',
        subtitle: 'Via Orchard, MacPherson, Bedok Reservoir, Tampines Ave 4',
        stops: [
          {
            id: 201,
            code: '14141',
            name: 'HarbourFront Int',
            road: 'Seah Im Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 38, y: 88 },
          },
          {
            id: 202,
            code: '75009',
            name: 'Tampines Int',
            road: 'Tampines Central 1',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 84, y: 26 },
          },
        ],
      },
    ],
  },
  '12': {
    serviceNo: '12',
    category: 'TRUNK',
    origin: 'Pasir Ris Int',
    destination: 'Kampong Bahru Ter',
    wab: true,
    electricFleet: true,
    totalDistance: '27.5 km (64 Stops)',
    totalStops: 64,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '6 - 10 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '8 - 12 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 14 mins',
    },
    activeBuses: [
      { plate: 'SBS1208D', stopId: 2, coords: { x: 88, y: 22 }, status: 'Pasir Ris to Kampong Bahru', load: 'seats', speed: '25 km/h' },
    ],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Kampong Bahru Ter',
        subtitle: 'Via Tampines East, Bedok, Mountbatten, Bugis, Chinatown',
        stops: [
          {
            id: 1,
            code: '77009',
            name: 'Pasir Ris Int',
            road: 'Pasir Ris Central',
            isTerminal: true,
            mrtBadges: [{ code: 'EW1', bg: '#009640', text: '#ffffff' }],
            arrivals: [],
            mapCoords: { x: 88, y: 20 },
          },
          {
            id: 2,
            code: '76031',
            name: 'Tampines East Stn Exit B',
            road: 'Tampines Ave 2',
            mrtBadges: [{ code: 'DT33', bg: '#005EC4', text: '#ffffff' }],
            arrivals: [
              { time: '4 min', load: 'seats', type: 'Double Decker', wab: true },
              { time: '13 min', load: 'standing', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 85, y: 28 },
          },
          {
            id: 3,
            code: '01059',
            name: 'Bugis Stn / Parkview Sq',
            road: 'North Bridge Rd',
            mrtBadges: [
              { code: 'EW12', bg: '#009640', text: '#ffffff' },
              { code: 'DT14', bg: '#005EC4', text: '#ffffff' },
            ],
            arrivals: [
              { time: '18 min', load: 'crowded', type: 'Double Decker', wab: true },
              { time: '29 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 68, y: 65 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Pasir Ris Int',
        subtitle: 'Via Chinatown, Bugis, Mountbatten, Bedok, Tampines East',
        stops: [
          {
            id: 101,
            code: '10041',
            name: 'Kampong Bahru Ter',
            road: 'Spooner Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 55, y: 84 },
          },
        ],
      },
    ],
  },
  '166': {
    serviceNo: '166',
    category: 'TRUNK',
    origin: 'Ang Mo Kio Int',
    destination: 'Clementi Int',
    wab: true,
    electricFleet: false,
    totalDistance: '26.8 km (62 Stops)',
    totalStops: 62,
    timetable: {
      weekdayHours: '05:40 - 23:45',
      weekdayHeadway: '7 - 12 mins',
      satHours: '05:40 - 23:45',
      satHeadway: '9 - 14 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 15 mins',
    },
    activeBuses: [
      { plate: 'SBS1662P', stopId: 2, coords: { x: 50, y: 35 }, status: 'Ang Mo Kio to Clementi', load: 'seats', speed: '27 km/h' },
    ],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Clementi Int',
        subtitle: 'Via Upper Thomson, Rochor, Chinatown, Alexandra, Dover Rd',
        stops: [
          {
            id: 1,
            code: '54009',
            name: 'Ang Mo Kio Int',
            road: 'Ang Mo Kio Ave 8',
            isTerminal: true,
            mrtBadges: [{ code: 'NS16', bg: '#D42E12', text: '#ffffff' }],
            arrivals: [],
            mapCoords: { x: 50, y: 30 },
          },
          {
            id: 2,
            code: '53049',
            name: 'Bishan Stn',
            road: 'Bishan St 13',
            mrtBadges: [
              { code: 'NS17', bg: '#D42E12', text: '#ffffff' },
              { code: 'CC15', bg: '#FFAA00', text: '#000000' },
            ],
            arrivals: [
              { time: 'Arr', load: 'seats', type: 'Double Decker', wab: true },
              { time: '9 min', load: 'seats', type: 'Double Decker', wab: true },
            ],
            mapCoords: { x: 50, y: 40 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Ang Mo Kio Int',
        subtitle: 'Via Dover Rd, Alexandra, Chinatown, Rochor, Thomson',
        stops: [
          {
            id: 101,
            code: '17179',
            name: 'Clementi Int',
            road: 'Clementi Ave 3',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 30, y: 85 },
          },
        ],
      },
    ],
  },
  '51': {
    serviceNo: '51',
    category: 'TRUNK',
    origin: 'Hougang Central Int',
    destination: 'Jurong East Int',
    wab: true,
    electricFleet: false,
    totalDistance: '37.2 km (84 Stops)',
    totalStops: 84,
    timetable: {
      weekdayHours: '05:30 - 23:30',
      weekdayHeadway: '8 - 14 mins',
      satHours: '05:30 - 23:30',
      satHeadway: '10 - 15 mins',
      sunHours: '05:45 - 23:30',
      sunHeadway: '12 - 16 mins',
    },
    activeBuses: [
      { plate: 'SBS5102X', stopId: 1, coords: { x: 22, y: 16 }, status: 'Hougang to Jurong East', load: 'standing', speed: '23 km/h' },
    ],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Jurong East Int',
        subtitle: 'Via MacPherson, Geylang, Bugis, Chinatown, Alexandra, West Coast',
        stops: [
          {
            id: 1,
            code: '64009',
            name: 'Hougang Central Int',
            road: 'Hougang Central',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 20, y: 16 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Hougang Central Int',
        subtitle: 'Via West Coast, Alexandra, Chinatown, Bugis, Geylang',
        stops: [
          {
            id: 101,
            code: '28009',
            name: 'Jurong East Int',
            road: 'Jurong Gateway Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 25, y: 70 },
          },
        ],
      },
    ],
  },
  '80': {
    serviceNo: '80',
    category: 'TRUNK',
    origin: 'Sengkang Int',
    destination: 'HarbourFront Int',
    wab: true,
    electricFleet: true,
    totalDistance: '27.0 km (65 Stops)',
    totalStops: 65,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '6 - 10 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '8 - 12 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 14 mins',
    },
    activeBuses: [
      { plate: 'SBS8011M', stopId: 1, coords: { x: 45, y: 22 }, status: 'Sengkang to HarbourFront', load: 'seats', speed: '25 km/h' },
    ],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards HarbourFront Int',
        subtitle: 'Via Hougang, Aljunied, Geylang, Bugis, Tanjong Pagar',
        stops: [
          {
            id: 1,
            code: '67009',
            name: 'Sengkang Int',
            road: 'Sengkang Sq',
            isTerminal: true,
            mrtBadges: [{ code: 'NE16', bg: '#8A31BC', text: '#ffffff' }],
            arrivals: [],
            mapCoords: { x: 45, y: 20 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Sengkang Int',
        subtitle: 'Via Tanjong Pagar, Bugis, Geylang, Aljunied, Hougang',
        stops: [
          {
            id: 101,
            code: '14141',
            name: 'HarbourFront Int',
            road: 'Seah Im Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 38, y: 88 },
          },
        ],
      },
    ],
  },
  '2': {
    serviceNo: '2',
    category: 'TRUNK',
    origin: 'Changi Village Ter',
    destination: 'Kampong Bahru Ter',
    wab: true,
    electricFleet: false,
    totalDistance: '26.3 km (59 Stops)',
    totalStops: 59,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '7 - 12 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '9 - 14 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 15 mins',
    },
    activeBuses: [],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Kampong Bahru Ter',
        subtitle: 'Via Upper Changi, Bedok, Victoria St, Chinatown',
        stops: [
          {
            id: 1,
            code: '99009',
            name: 'Changi Village Ter',
            road: 'Changi Village Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 92, y: 15 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Changi Village Ter',
        subtitle: 'Via Chinatown, Victoria St, Bedok, Upper Changi',
        stops: [
          {
            id: 101,
            code: '10041',
            name: 'Kampong Bahru Ter',
            road: 'Spooner Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 55, y: 84 },
          },
        ],
      },
    ],
  },
  '74': {
    serviceNo: '74',
    category: 'TRUNK',
    origin: 'Hougang Central Int',
    destination: 'Buona Vista Ter',
    wab: true,
    electricFleet: true,
    totalDistance: '22.8 km (54 Stops)',
    totalStops: 54,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '6 - 11 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '8 - 13 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '10 - 15 mins',
    },
    activeBuses: [],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Buona Vista Ter',
        subtitle: 'Via Ang Mo Kio, Marymount, Clementi Rd, Dover',
        stops: [
          {
            id: 1,
            code: '64009',
            name: 'Hougang Central Int',
            road: 'Hougang Central',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 20, y: 16 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Hougang Central Int',
        subtitle: 'Via Dover, Clementi Rd, Marymount, Ang Mo Kio',
        stops: [
          {
            id: 101,
            code: '11389',
            name: 'Buona Vista Ter',
            road: 'Holland Dr',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 40, y: 75 },
          },
        ],
      },
    ],
  },
  '190': {
    serviceNo: '190',
    category: 'TRUNK',
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    wab: true,
    electricFleet: true,
    totalDistance: '21.4 km (42 Stops)',
    totalStops: 42,
    timetable: {
      weekdayHours: '05:30 - 23:45',
      weekdayHeadway: '4 - 8 mins',
      satHours: '05:30 - 23:45',
      satHeadway: '6 - 10 mins',
      sunHours: '05:45 - 23:45',
      sunHeadway: '8 - 12 mins',
    },
    activeBuses: [],
    directions: [
      {
        id: 1,
        title: 'Direction 1: Towards Kampong Bahru Ter',
        subtitle: 'Via Bukit Panjang, Stevens, Orchard, Clarke Quay',
        stops: [
          {
            id: 1,
            code: '44009',
            name: 'Choa Chu Kang Int',
            road: 'Choa Chu Kang Loop',
            isTerminal: true,
            mrtBadges: [{ code: 'NS4', bg: '#D42E12', text: '#ffffff' }],
            arrivals: [],
            mapCoords: { x: 25, y: 35 },
          },
        ],
      },
      {
        id: 2,
        title: 'Direction 2: Towards Choa Chu Kang Int',
        subtitle: 'Via Clarke Quay, Orchard, Stevens, Bukit Panjang',
        stops: [
          {
            id: 101,
            code: '10041',
            name: 'Kampong Bahru Ter',
            road: 'Spooner Rd',
            isTerminal: true,
            arrivals: [],
            mapCoords: { x: 55, y: 84 },
          },
        ],
      },
    ],
  },
};

export const POPULAR_TRUNKS = ['147', '65', '12', '166', '51', '80', '2', '74', '190'];

export const SYSTEM_ALERTS = [
  {
    id: 'alert-1',
    line: 'North East Line (NEL)',
    type: 'Normal Service',
    badgeColor: 'bg-emerald-600',
    details: 'Trains running normally across all 16 stations from HarbourFront to Punggol Coast.',
  },
  {
    id: 'alert-2',
    line: 'Downtown Line (DTL)',
    type: 'Normal Service',
    badgeColor: 'bg-emerald-600',
    details: 'Full regular frequency maintained between Bukit Panjang and Expo.',
  },
  {
    id: 'alert-3',
    line: 'Bus Service 147 & 65',
    type: 'Minor Congestion',
    badgeColor: 'bg-amber-600',
    details: 'Moderate peak-hour delays (approx 3-5 mins) along Eu Tong Sen St towards Chinatown due to traffic signal maintenance.',
  },
  {
    id: 'alert-4',
    line: 'Circle Line (CCL)',
    type: 'Normal Service',
    badgeColor: 'bg-emerald-600',
    details: 'Standard peak headways running smoothly.',
  },
];
