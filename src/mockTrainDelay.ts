export interface TrainDelay {
  hour: number;
  totalDelay: number; // in minutes
}

// Mock data representing total delay per hour for today
export const trainDelayData: TrainDelay[] = [
  { hour: 0, totalDelay: 2 },
  { hour: 1, totalDelay: 5 },
  { hour: 2, totalDelay: 0 },
  { hour: 3, totalDelay: 1 },
  { hour: 4, totalDelay: 0 },
  { hour: 5, totalDelay: 3 },
  { hour: 6, totalDelay: 8 },
  { hour: 7, totalDelay: 15 },
  { hour: 8, totalDelay: 12 },
  { hour: 9, totalDelay: 7 },
  { hour: 10, totalDelay: 6 },
  { hour: 11, totalDelay: 4 },
  { hour: 12, totalDelay: 9 },
  { hour: 13, totalDelay: 5 },
  { hour: 14, totalDelay: 11 },
  { hour: 15, totalDelay: 8 },
  { hour: 16, totalDelay: 14 },
  { hour: 17, totalDelay: 20 },
  { hour: 18, totalDelay: 18 },
  { hour: 19, totalDelay: 10 },
  { hour: 20, totalDelay: 6 },
  { hour: 21, totalDelay: 4 },
  { hour: 22, totalDelay: 3 },
  { hour: 23, totalDelay: 1 }
];
