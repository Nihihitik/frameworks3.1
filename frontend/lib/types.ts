// ISS Response types
export type ISSPayload = {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
};

export type ISSResponse = {
  id: number;
  fetched_at: string;
  payload: ISSPayload;
};

// ISS Trend Response
export type TrendResponse = {
  movement: string;
  delta_km: number;
  dt_sec: number;
  velocity_kmh: number;
  from_lat: number;
  from_lon: number;
  to_lat: number;
  to_lon: number;
};

// OSDR Types
export type OSDRItem = {
  id: number;
  study_id: string;
  title: string;
  description: string;
  project_link: string;
  created_at: string;
};

export type OSDRListResponse = {
  items: OSDRItem[];
  total: number;
  page: number;
  page_size: number;
};

// Space Cache Types
export type APODData = {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
};

export type NEOData = {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
};

export type FLRData = {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string;
  sourceLocation: string;
  linkedEvents?: Array<{
    activityID: string;
  }>;
};

export type CMEData = {
  activityID: string;
  startTime: string;
  sourceLocation: string;
  note: string;
  linkedEvents?: Array<{
    activityID: string;
  }>;
};

export type SpaceXData = {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  details: string | null;
  links: {
    patch: {
      small: string | null;
    };
    webcast: string | null;
  };
};

export type SpaceCacheItem = {
  id: number;
  source: string;
  data: APODData | NEOData | FLRData | CMEData | SpaceXData;
  fetched_at: string;
};

export type SpaceSummaryResponse = {
  apod: SpaceCacheItem | null;
  neo: SpaceCacheItem[];
  flr: SpaceCacheItem[];
  cme: SpaceCacheItem[];
  spacex: SpaceCacheItem[];
  iss: ISSResponse | null;
  osdr_count: number;
};

// JWST Types
export type JWSTItem = {
  id: string;
  observation_id: string;
  program: number;
  details: {
    description: string;
    mission: string;
  };
  file_type: string;
  thumbnail: string;
  location: string;
};

export type JWSTFeedResponse = {
  source: string;
  count: number;
  items: JWSTItem[];
};

// Astro Events Types (generic JSON response)
export type AstroEventsResponse = {
  data: {
    table: {
      header: string[];
      rows: Array<{
        cells: Array<{
          date: string;
          [key: string]: unknown;
        }>;
      }>;
    };
  };
};
