import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { RbacService } from '../../../core/services/rbac.service';

export interface TrendsRequestDto {
  startDate: string;
  endDate: string;
  cardTypes: string[];
  groupBy: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  includeBreakdown: boolean;
  comparisonPeriod: 'SAME_PERIOD_LAST_YEAR' | 'PREVIOUS_PERIOD' | 'NONE';
}

export interface CardTypeAmount {
  [key: string]: number;
}

export interface PeriodData {
  period: string;
  totalAmount: number;
  cardTypeAmounts: CardTypeAmount;
  transactionCount: number;
}

export interface ServiceCategoryTrend {
  serviceCategory: string;
  totalAmount: number;
  percentageOfTotal: number;
  growthRate: number;
}

export interface TrendsResponseDto {
  startDate: string;
  endDate: string;
  groupBy: string;
  cardTypes: string[];
  periodData: PeriodData[];
  serviceCategoryTrends: ServiceCategoryTrend[];
  overallGrowthRate: number;
  insights: string[];
}

export interface AnomalyDto {
  anomalyId: string;
  cardType: string;
  description: string;
  expectedValue: number;
  actualValue: number;
  deviationPercentage: number;
  serviceCode: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private http: HttpClient,
    private rbacService: RbacService
  ) {}

  /**
   * Get trends analysis data
   */
  getTrendsAnalysis(request: TrendsRequestDto): Observable<TrendsResponseDto> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
    });

    return this.http.post<TrendsResponseDto>(
      `${environment.apiUrl}/api/analytics/trends`,
      request,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error fetching analytics trends:', error);
        return throwError(() => new Error('Failed to load analytics data. Please try again later.'));
      })
    );
  }

  /**
   * Get anomalies for a specific card type
   */
  getAnomalies(cardType: string, threshold: number = 2, period: number = 6): Observable<AnomalyDto[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
    });

    return this.http.post<AnomalyDto[]>(
      `${environment.apiUrl}/api/analytics/${cardType.toLowerCase()}/anomalies?threshold=${threshold}&period=${period}`,
      {},
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error fetching anomalies:', error);
        return throwError(() => new Error('Failed to load anomaly data. Please try again later.'));
      })
    );
  }

  /**
   * Check if user has access to analytics
   */
  hasAnalyticsAccess(): Observable<boolean> {
    return this.rbacService.hasPermission('analytics', 'view');
  }
}