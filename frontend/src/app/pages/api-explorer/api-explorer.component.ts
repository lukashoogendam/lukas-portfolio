import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ApiSidebarComponent } from './api-sidebar/api-sidebar';
import { ApiRequestComponent } from './api-request/api-request';
import { ApiResponseComponent } from './api-response/api-response';
import { ApiExplorerService } from './api-explorer.service';

@Component({
  selector: 'app-api-explorer',
  imports: [CommonModule, ApiSidebarComponent, ApiRequestComponent, ApiResponseComponent],
  templateUrl: './api-explorer.component.html',
  styleUrl: './api-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiExplorerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiState = inject(ApiExplorerService);

  get isMobileSidebarOpen() { return this.apiState.isMobileSidebarOpen; }
  get selectedEndpoint() { return this.apiState.selectedEndpoint; }

  ngOnInit(): void {
    this.apiState.init();

    this.route.queryParams.subscribe(params => {
      if (params['endpoint']) {
        const targetEndpoint = this.apiState.allEndpoints.find(e => e.path === params['endpoint']);
        if (targetEndpoint) {
          if (this.apiState.selectedEndpoint()?.path !== targetEndpoint.path) {
            this.apiState.selectEndpoint(targetEndpoint);
          }
        }
      } else {
        if (!this.apiState.selectedEndpoint()) {
          this.apiState.selectEndpoint(this.apiState.allEndpoints[0]); 
        }
      }
    });
  }
}
