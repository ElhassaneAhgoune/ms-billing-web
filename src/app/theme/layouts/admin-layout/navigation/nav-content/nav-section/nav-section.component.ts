import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';

import { NavigationItem } from '../../navigation';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-section',
  imports: [CommonModule, IconDirective, RouterModule, NavItemComponent],
  templateUrl: './nav-section.component.html',
  styleUrls: ['./nav-section.component.scss'],
  standalone: true
})
export class NavSectionComponent {
  @Input() section!: NavigationItem;
  @Input() items: NavigationItem[] = [];
  
  @HostBinding('attr.section-id')
  get sectionId(): string {
    return this.section?.id || '';
  }
  
  isCollapsed = false;

  toggleSection(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }
}