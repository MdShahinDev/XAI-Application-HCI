
export enum View {
  LANDING = 'landing',
  DASHBOARD = 'dashboard'
}

export enum DashboardTab {
  DASHBOARD = 'Dashboard',
  MARKER_GENE = 'Marker Gene',
  CELL_TYPE = 'Cell type annotation',
  CELL_STATUS = 'Cell Status',
  ASK_AI = 'Ask With AI'
}

export interface Experiment {
  id: string;
  name: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  type: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
