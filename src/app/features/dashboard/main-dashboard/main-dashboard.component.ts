import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
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
  public activityChartOptions: Partial<ChartOptions>;
  public networkDistributionOptions: Partial<ChartOptions>;
  
  // Data
  visaInvoiceCount: number = 0;
  mastercardInvoiceCount: number = 0;
  totalAmount: number = 0;
  recentActivity: any[] = [];
  recentLogins: any[] = [];
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
  
  // For cleanup
  private destroy$ = new Subject<void>();
  
  constructor(
    private billingService: BillingService,
    private analyticsService: AnalyticsService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.initCharts();
  }
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  ngAfterViewInit(): void {
    // Additional initialization if needed
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Load Visa invoices count
    this.billingService.getVisaInvoices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoices) => {
          this.visaInvoiceCount = invoices.length;
          this.calculateTotalAmount(invoices, 'visa');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    
    // Load Mastercard invoices count
    this.billingService.getMastercardInvoices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoices) => {
          this.mastercardInvoiceCount = invoices.length;
          this.calculateTotalAmount(invoices, 'mastercard');
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    
    // Generate sample data for demonstration
    this.generateSampleData();
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
    this.errorMessage = error.message || 'Failed to load dashboard data';
    console.error('Error loading dashboard data:', error);
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
    
    // Generate sample recent logins
    this.recentLogins = [
      { user: 'John Smith', role: 'Admin', time: new Date(2025, 3, 3, 9, 15), ip: '192.168.1.101' },
      { user: 'Sarah Johnson', role: 'Manager', time: new Date(2025, 3, 2, 14, 30), ip: '192.168.1.102' },
      { user: 'Michael Brown', role: 'Analyst', time: new Date(2025, 3, 2, 10, 45), ip: '192.168.1.103' },
      { user: 'Emily Davis', role: 'Accountant', time: new Date(2025, 3, 1, 16, 20), ip: '192.168.1.104' }
    ];
    
    // Generate sample monthly trends
    this.monthlyTrends = [
      { month: 'Jan', visa: 45000, mastercard: 38000 },
      { month: 'Feb', visa: 52000, mastercard: 41000 },
      { month: 'Mar', visa: 49000, mastercard: 44000 },
      { month: 'Apr', visa: 58000, mastercard: 50000 },
      { month: 'May', visa: 61000, mastercard: 52000 },
      { month: 'Jun', visa: 64000, mastercard: 55000 }
    ];
    
    // Update charts with the sample data
    this.updateCharts();
  }
  
  initCharts(): void {
    // Initialize activity chart
    this.activityChartOptions = {
      series: [
        {
          name: 'Visa',
          data: []
        },
        {
          name: 'Mastercard',
          data: []
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        type: 'category',
        categories: []
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        }
      },
      colors: ['#2563eb', '#64748b'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColors: ['#2563eb', '#64748b'],
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      yaxis: {
        title: {
          text: 'Amount'
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
    
    // Initialize network distribution chart
    this.networkDistributionOptions = {
      series: [this.visaInvoiceCount, this.mastercardInvoiceCount],
      chart: {
        type: 'donut',
        height: 240
      },
      labels: ['Visa', 'Mastercard'],
      colors: ['#2563eb', '#64748b'],
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
          formatter: function(val) {
            return val + " invoices";
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
                formatter: function(val) {
                  return val;
                }
              },
              total: {
                show: true,
                label: 'Total',
                formatter: function(w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      }
    };
  }
  
  updateCharts(): void {
    // Update activity chart with monthly trends data
    if (this.monthlyTrends.length > 0) {
      const categories = this.monthlyTrends.map(item => item.month);
      const visaData = this.monthlyTrends.map(item => item.visa);
      const mastercardData = this.monthlyTrends.map(item => item.mastercard);
      
      this.activityChartOptions = {
        ...this.activityChartOptions,
        series: [
          {
            name: 'Visa',
            data: visaData
          },
          {
            name: 'Mastercard',
            data: mastercardData
          }
        ],
        xaxis: {
          ...this.activityChartOptions.xaxis,
          categories: categories
        }
      };
    }
    
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
  
  navigateToFollowUp(): void {
    this.router.navigate(['/follow-up']);
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
}