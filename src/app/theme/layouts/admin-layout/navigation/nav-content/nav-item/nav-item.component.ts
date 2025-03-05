// Angular import
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Project import
import { NavigationItem } from '../../navigation';
import { RbacDirective } from 'src/app/core/directives/rbac.directive';
import { RbacService } from 'src/app/core/services/rbac.service';
import { AuthService } from 'src/app/core/authentication/auth.service';


import { IconDirective } from '@ant-design/icons-angular';

@Component({
  selector: 'app-nav-item',
  imports: [CommonModule, IconDirective, RouterModule, RbacDirective],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  // public props
  @Input() item!: NavigationItem;
  hasPermission = true;
  isAuthenticated = false;

  
  get tooltipContent(): string {
    let tooltip = this.item.description || '';
    
    // Add tooltip title if available
    if (this.item.tooltipTitle) {
      tooltip = this.item.tooltipTitle + (tooltip ? ': ' + tooltip : '');
    }
    
    // Add API endpoint information if available
    if (this.item.apiEndpoint) {
      tooltip += tooltip ? '\n' : '';
      tooltip += 'API: ' + this.item.apiEndpoint;
    }
    
    return tooltip;
  }

  constructor(
    private rbacService: RbacService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated = this.authService.isAuthenticated;
    
    // If not authenticated and trying to access protected routes, return
    if (!this.isAuthenticated && this.isProtectedRoute(this.item.url)) {
      this.hasPermission = false;
      return;
    }
    

    // Check permissions for navigation items based on resourceId
    if (this.item.resourceId) {
      this.rbacService.hasPermission(this.item.resourceId, 'view')
        .subscribe(hasAccess => {
          this.hasPermission = hasAccess;
        });
    }
  }
  
  // Check if a route should be protected
  public isProtectedRoute(url: string | undefined): boolean {
    if (!url) return false;
    
    // List of route prefixes that should be protected
    const protectedPrefixes = [
      '/dashboard',
      '/invoices',
      '/csv-files',
      '/profile'
    ];
    
    return protectedPrefixes.some(prefix => url.startsWith(prefix));
  }


  // public method
  closeOtherMenu(event: MouseEvent) {
    // Prevent default behavior and stop propagation
    event.preventDefault();
    event.stopPropagation();
    
    // Get the clicked element
    const ele = event.target as HTMLElement;
    if (ele !== null && ele !== undefined) {
      // Find the closest anchor element if the click was on a child element
      const anchor = ele.closest('a') || ele;
      const parent = anchor.parentElement as HTMLElement;
      const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      const last_parent = up_parent.parentElement;
      
      // Close all other menu items
      const sections = document.querySelectorAll('.coded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('coded-trigger');
      }

      // Set active state on the clicked item and its parents
      if (parent.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
      
      // Add active class to the clicked item
      parent.classList.add('active');
    }
    
    // Close mobile menu if open
    if ((document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement)?.classList.contains('mob-open')) {
      (document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.remove('mob-open');
    }
    
    // Navigate programmatically after a short delay to ensure UI updates first
    if (this.item.url && !this.item.external) {
      setTimeout(() => {
        this.router.navigate([this.item.url]);
      }, 50);
    } else if (this.item.url && this.item.external) {
      setTimeout(() => {
        const target = typeof this.item.target === 'string' ? this.item.target : '_self';
        window.open(this.item.url, target);
      }, 50);
    }
  }
}
