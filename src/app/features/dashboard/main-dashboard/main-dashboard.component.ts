import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ConnexionFollowUpQueryParams,SummaryStatsDto } from '../../../core/models/invoice.models';
import { ConnexionFollowUpDto,UserProfileDto  } from '../../../core/models/auth.models';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { BillingService } from '../../../core/services/billing.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  markers?: ApexMarkers;
  colors?: string[];
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  labels?: string[];
  plotOptions?: any;
  responsive?: any;
  states?: any;
};

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgClass,
    NgSelectModule,
    NgApexchartsModule,
    CardComponent
  ],
  providers: [DatePipe]
})
export class MainDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("activityChart") activityChart: ChartComponent;
  
  // Chart options
  public visaSummaryOptions: Partial<ChartOptions>;
  public mastercardSummaryOptions: Partial<ChartOptions>;
  public networkDistributionOptions: Partial<ChartOptions>;
  
  //User 
  userProfile: UserProfileDto | null = null;
  isManager: boolean = false;

  // Data
  visaStats : SummaryStatsDto | null = null;
  mastercardStats : SummaryStatsDto | null = null;
  visaInvoiceCount: number = 0;
  mastercardInvoiceCount: number = 0;
  acquisition: number = 0;
  issuer: number = 0;
  both: number = 0;
  visaAcquisition: number = 0;
  visaIssuer: number = 0;
  visaBoth: number = 0;
  totalAmount: number = 0;
  recentActivity: any[] = [];
  kpiMetrics: any = {
    avgProcessingTime: 2.4,
    errorRate: 0.5,
    pendingInvoices: 12,
    completionRate: 98.2
  };
  monthlyTrends: any[] = [];
  
  // UI state
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  //Connexion History
  currentPage = 0;
  pageSize = 5;
  connexionHistory: ConnexionFollowUpDto[] = [];
  loadingConnexion = false;
  connexionError = '';
  
  // For cleanup
  private destroy$ = new Subject<void>();
  
  constructor(
    private billingService: BillingService,
    private analyticsService: AnalyticsService,
    private router: Router,
    private datePipe: DatePipe,
    private userService: UserService,
  ) {

  }
  
  ngOnInit(): void {
    this.loadUserProfile();
    this.loadStatsData();
    this.initCharts();
    this.loadConnectionHistory();
  }
  
  ngAfterViewInit(): void {
    // Additional initialization if needed
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
        if ( this.userProfile &&  this.userProfile.role) {
          this.isManager = profile.role.includes('ROLE_MANAGER');
        }
        console.log('Is manager:', this.isManager);
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.isLoading = false;
      }
    });
  }
  
  loadStatsData(): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Load Visa invoices count
    this.billingService.getVisaStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respone) => {
          this.visaStats = respone;
          this.visaInvoiceCount = this.visaStats.total || 0;
          console.log('Visa stats:', this.visaStats);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    
    // Load Mastercard invoices count
    this.billingService.getMasterCardStats()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (respone) => {
        this.mastercardStats = respone;
        this.mastercardInvoiceCount = this.mastercardStats.total || 0;
        console.log('mastercard stats:', this.mastercardStats);
      },
      error: (error) => {
        this.handleError(error);
      }

    });
    this.isLoading = false;
    
    // Generate sample data for demonstration
    this.generateSampleData();
  }

  //Connexion History
  loadConnectionHistory(): void {
    this.loadingConnexion = true;
    this.connexionError = '';
    const params: ConnexionFollowUpQueryParams = {
      page: this.currentPage,
      size: this.pageSize,
    };
    
   this.userService.getConnectionFollowUp(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
        'content' in data && 'totalElements' in data && 'totalPages' in data) {
        const paginatedData = data as { content: ConnexionFollowUpDto[], totalElements: number, totalPages: number };
        this.connexionHistory = paginatedData.content;
        this.loadingConnexion = false;
         } else{
        this.connexionHistory = data;
        this.loadingConnexion = false;
      }},
      error: (error) => {
        console.error('Error loading connection history:', error);
        this.connexionError = 'Failed to load connection history. Please try again.';
        this.loadingConnexion = false;
      }
    });
  }
  
  calculateTotalAmount(invoices: any[], type: string): void {
    if (invoices && invoices.length > 0) {
      const sum = invoices.reduce((total, invoice) => {
        return total + (invoice.totalAmount || 0);
      }, 0);
      this.totalAmount += sum;
    }
  }
  
  handleError(error: any): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = error.message || 'Failed to load summary data';
    console.error('Error loading sumary data:', error);
  }
  
  generateSampleData(): void {
    // Generate sample recent activity
    this.recentActivity = [
      { id: 'INV-2023-001', type: 'VISA', date: new Date(2025, 3, 2), amount: 12450.75, status: 'Processed' },
      { id: 'INV-2023-002', type: 'MASTERCARD', date: new Date(2025, 3, 1), amount: 8320.50, status: 'Pending' },
      { id: 'INV-2023-003', type: 'VISA', date: new Date(2025, 2, 28), amount: 5670.25, status: 'Processed' },
      { id: 'INV-2023-004', type: 'MASTERCARD', date: new Date(2025, 2, 27), amount: 9840.00, status: 'Processed' },
      { id: 'INV-2023-005', type: 'VISA', date: new Date(2025, 2, 26), amount: 3210.80, status: 'Error' }
    ];
    
    
    // Update charts with the sample data
    this.updateCharts();
  }
  
  initCharts(): void {
    this.visaSummaryOptions = {
      series: [this.visaAcquisition, this.visaIssuer,this.visaBoth],
      chart: {
        type: 'pie', 
        height: 300
      },
      labels: ['acquisition', 'issuer', 'both'],
      colors: ['#4680ff', '#ffba57', '#0e9e4a'], 
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return (typeof val === 'number' ? val.toFixed(1) : val) + "%"; 
        }
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return this.formatNumber(val) + " $"; 
          }
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                formatter: (val) => {
                  return this.formatNumber(val)+ " $"; 
                }
              },
             
            }
          }
        }
      }
    };

    this.mastercardSummaryOptions = {
      series: [this.acquisition, this.issuer,this.both],
      chart: {
        type: 'pie', 
        height: 300
      },
      labels: ['acquisition', 'issuer', 'both'],
      colors: ['#4680ff', '#ffba57', '#0e9e4a'], 
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return (typeof val === 'number' ? val.toFixed(1) : val) + "%"; 
        }
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return this.formatNumber(val) + " $"; 
          }
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                formatter: (val) => {
                  return this.formatNumber(val)+ " $"; 
                }
              },
             
            }
          }
        }
      }
    };
    // Initialize network distribution chart
    this.networkDistributionOptions = {
      series: [this.visaInvoiceCount, this.mastercardInvoiceCount],
      chart: {
        type: 'donut',
        height: 300
      },
      labels: ['Visa', 'Mastercard'],
      colors: ['#2563eb', '#FF5F00'],
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return (typeof val === 'number' ? val.toFixed(1) : val) + "%";
        }
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return this.formatNumber(val) + " $"; 
          }
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                formatter: (val) => {
                  return this.formatNumber(val)+ " $"; 
                }
              },
              total: {
                show: true,
                label: 'Total',
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  const totalNumber = Number(total); 
                  return this.formatNumber(totalNumber)+ " $";
                }
              }
            }
          }
        }
      }
    };
  }
  
  updateCharts(): void {
    
    // Update network distribution chart
    this.networkDistributionOptions = {
      ...this.networkDistributionOptions,
      series: [this.visaInvoiceCount, this.mastercardInvoiceCount]
    };
  }
  
  navigateToInvoices(type: string): void {
    if (type === 'visa') {
      this.router.navigate(['/invoices/visa']);
    } else if (type === 'mastercard') {
      this.router.navigate(['/invoices/mastercard']);
    }
  }
  navigateToUpload(type: string): void {
    if (type === 'visa') {
      this.router.navigate(['/invoices/visa/upload']);
    } else if (type === 'mastercard') {
      this.router.navigate(['/invoices/mastercard/upload']);
    }
  }
  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }
  navigateToFollowUp(): void {
    this.router.navigate(['/follow-up']);
  }
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM dd, yyyy') || '';
  }
  
  formatDateTime(date: Date): string {
    return this.datePipe.transform(date, 'MMM dd, yyyy HH:mm') || '';
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'error':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
  formatNumber(value: number ): string {
    if (value === null || value === undefined) return '';

    const number = typeof value === 'string' ? parseFloat(value) : value;


    const rounded = Math.round(number); 

    const formatted = rounded.toLocaleString();

    return formatted;
  }
}