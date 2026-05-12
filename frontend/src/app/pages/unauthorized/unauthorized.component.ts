import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnauthorizedComponent {}
