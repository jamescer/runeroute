import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { EditablePact } from './pact-tree.model';

@Component({
  selector: 'app-pact-node',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pact-node"
      [class.allocated]="pact.allocated"
      [class.keystone]="pact.type === 'keystone'"
      [class.root]="pact.isRoot"
      [class.selected]="isSelected"
    >
      <span class="pact-path-dot" [attr.data-path]="pact.path"></span>
      <span class="pact-name">{{ pact.name || 'Untitled pact' }}</span>
      <span class="pact-cost" *ngIf="pact.cost > 1">{{ pact.cost }} pts</span>
    </div>
  `,
  styles: [
    `
      .pact-node {
        min-width: 110px;
        max-width: 150px;
        padding: 0.5rem 0.7rem;
        border-radius: 999px;
        background: #211e1a;
        border: 2px solid #44403a;
        color: #b8ad99;
        font-size: 0.78rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        cursor: pointer;
        user-select: none;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
      }

      .pact-node.root {
        border-radius: 8px;
        border-color: #6b5d3f;
      }

      .pact-node.keystone {
        border-radius: 8px;
        min-width: 130px;
        border-width: 3px;
      }

      .pact-node.allocated {
        background: #3a2f18;
        border-color: #d8c89a;
        color: #fdf8ee;
      }

      .pact-node.selected {
        box-shadow: 0 0 0 2px #6b9bd1;
      }

      .pact-path-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #5a5347;
      }

      .pact-path-dot[data-path='fury'] {
        background: #b06a5a;
      }
      .pact-path-dot[data-path='precision'] {
        background: #6b9bd1;
      }
      .pact-path-dot[data-path='shadows'] {
        background: #8a6bd1;
      }

      .pact-cost {
        font-size: 0.65rem;
        color: #8a8071;
      }
    `,
  ],
})
export class PactNodeComponent {
  @Input({ required: true }) pact!: EditablePact;
  @Input() isSelected = false;
}
