// Angular import
import { Component, OnInit, inject, output, HostListener } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem, NavigationItems } from '../navigation';
import { environment } from 'src/environments/environment';

import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavSectionComponent } from './nav-section/nav-section.component';

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  DashboardOutline,
  CreditCardOutline,
  LoginOutline,
  QuestionOutline,
  ChromeOutline,
  FontSizeOutline,
  ProfileOutline,
  BgColorsOutline,
  AntDesignOutline,
  FileOutline,
  FileSearchOutline,
  UploadOutline,
  FileTextOutline,
  LineChartOutline,
  PieChartOutline,
  FileExcelOutline,
  FolderOutline,
  CrownOutline,
  TableOutline

} from '@ant-design/icons-angular/icons';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-nav-content',
  imports: [CommonModule, RouterModule, NavGroupComponent, NavSectionComponent, NgScrollbarModule],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private iconService = inject(IconService);

  // public props
  NavCollapsedMob = output();

  navigations: NavigationItem[];

  // version
  title = 'MS Billing Application';
  currentApplicationVersion = environment.appVersion;

  // Online status
  isOnline = navigator.onLine;

  navigation = NavigationItems;
  windowWidth = window.innerWidth;

  // Constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        CreditCardOutline,
        FontSizeOutline,
        LoginOutline,
        ProfileOutline,
        BgColorsOutline,
        AntDesignOutline,
        ChromeOutline,
        QuestionOutline,
        FileOutline,
        FileSearchOutline,
        UploadOutline,
        FileTextOutline,
        LineChartOutline,
        PieChartOutline,
        FileExcelOutline,
        FolderOutline,
        CrownOutline,
        TableOutline
      ]
    );
    this.navigations = NavigationItems;
    
    // Online/offline event listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Life cycle events
  ngOnInit() {
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement)?.classList.add('menupos-static');
    }
  }
  
  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Listen for window resize
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }
  
  // Handle click events
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // Don't handle clicks that will be handled by child components
    if ((event.target as HTMLElement).closest('app-nav-item, app-nav-collapse')) {
      return;
    }
    
    const target = event.target as HTMLElement;
    const navItem = target.closest('a');
    
    if (navItem) {
      // Use requestAnimationFrame to ensure DOM operations are batched
      requestAnimationFrame(() => {
        // Add active class directly to ensure visual feedback
        const listItem = navItem.closest('li');
        if (listItem) {
          // Remove active class from all items first
          document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
          });
          
          // Add active class to clicked item
          listItem.classList.add('active');
        }
      });
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }

  // Helper methods for nav sections
  getSection(sectionId: string): NavigationItem {
    // For Invoice Management sections
    if (sectionId === 'visa-section' || sectionId === 'mastercard-section' || sectionId === 'history-section') {
      const invoiceManagement = this.navigations.find(item => item.id === 'visa-management');
      if (invoiceManagement && invoiceManagement.children) {
        return invoiceManagement.children.find(item => item.id === sectionId) as NavigationItem;
      }
      return {
        id: sectionId,
        title: sectionId === 'visa-section' ? 'Visa' :
               sectionId === 'mastercard-section' ? 'Mastercard' : 'History',
        type: 'item',
        icon: sectionId === 'history-section' ? 'history' : 'credit-card',
        url: '#'
      };
    }
    
    // For Settings sections
    if (sectionId === 'users-section' || sectionId === 'bank-section') {
      const settingsManagement = this.navigations.find(item => item.id === 'settings-management');
      if (settingsManagement && settingsManagement.children) {
        return settingsManagement.children.find(item => item.id === sectionId) as NavigationItem;
      }
      return {
        id: sectionId,
        title: sectionId === 'users-section' ? 'Users' : 'Banks',
        type: 'item',
        icon: sectionId === 'users-section' ? 'user' : 'bank',
        url: '#'
      };
    }
    
    return {
      id: sectionId,
      title: 'Section',
      type: 'item',
      icon: 'folder',
      url: '#'
    };
  }

  getItemsForSection(sectionType: 'visa' | 'mastercard' | 'history' | 'users' | 'banks'): NavigationItem[] {
    // For Invoice Management sections
    if (sectionType === 'visa' || sectionType === 'mastercard' || sectionType === 'history') {
      const invoiceManagement = this.navigations.find(item => item.id === 'visa-management');
      if (invoiceManagement && invoiceManagement.children) {
        return invoiceManagement.children.filter(item => {
          if (sectionType === 'visa') {
            return item.id !== 'visa-section' &&
                   item.id !== 'mastercard-section' &&
                   item.id !== 'history-section' &&
                   item.id.startsWith('visa') &&
                   !item.hidden;
          } else if (sectionType === 'mastercard') {
            return item.id !== 'visa-section' &&
                   item.id !== 'mastercard-section' &&
                   item.id !== 'history-section' &&
                   item.id.startsWith('mastercard') &&
                   !item.hidden;
          } else if (sectionType === 'history') {
            return item.id !== 'visa-section' &&
                   item.id !== 'mastercard-section' &&
                   item.id !== 'history-section' &&
                   item.id === 'csv-files';
          }
          return false;
        });
      }
    }
    
    // For Settings sections
    if (sectionType === 'users' || sectionType === 'banks') {
      const settingsManagement = this.navigations.find(item => item.id === 'settings-management');
      if (settingsManagement && settingsManagement.children) {
        return settingsManagement.children.filter(item => {
          if (sectionType === 'users') {
            return item.id !== 'users-section' &&
                   item.id !== 'bank-section' &&
                   (item.id === 'actions-follow-up' || item.id === 'users-list') &&
                   !item.hidden;
          } else if (sectionType === 'banks') {
            return item.id !== 'users-section' &&
                   item.id !== 'bank-section' &&
                   item.id.startsWith('bank') &&
                   !item.hidden;
          }
          return false;
        });
      }
    }
    
    return [];
  }
}
