export interface Course {
  id: number;
  code: string;
  title: string;
  department: string;
  credits: number;
  enrollment: number;
  rating: number;
  online: boolean;
}

export interface DepartmentStatistic {
  count: number;
  averageRating: number;
  totalEnrollment: number;
}

export type DepartmentStatistics = Record<string, DepartmentStatistic>;
