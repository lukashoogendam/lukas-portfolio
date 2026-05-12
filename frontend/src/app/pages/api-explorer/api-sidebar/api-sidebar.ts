import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiExplorerService, EndpointGroup, Endpoint } from '../api-explorer.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-api-sidebar',
  imports: [CommonModule],
  templateUrl: './api-sidebar.html',
  styleUrl: '../api-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiSidebarComponent {
  public apiState = inject(ApiExplorerService);
  public swaggerUrl = environment.swaggerUrl;

  get endpointGroups() { return this.apiState.endpointGroups; }
  get selectedEndpoint() { return this.apiState.selectedEndpoint; }
  get isMobileSidebarOpen() { return this.apiState.isMobileSidebarOpen; }
  get totalEndpointCount() { return this.apiState.allEndpoints.length; }

  toggleMobileSidebar() { this.apiState.toggleMobileSidebar(); }
  
  toggleGroup(group: EndpointGroup) {
    group.expanded = !group.expanded;
    // trigger change detection by creating a new array reference
    this.apiState.endpointGroups.update(groups => [...groups]);
  }

  selectEndpoint(endpoint: Endpoint) {
    this.apiState.selectEndpoint(endpoint);
  }
}
