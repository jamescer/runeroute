import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vflow, type Connection, type Edge, type Node, createEdge } from 'ngx-vflow';
import type { PactTree } from 'osrs-tools';
import { PactNodeComponent } from './pact-node.component';
import { type EditablePact, createEmptyPact, toPactTree, fromPactTree } from './pact-tree.model';

@Component({
  selector: 'app-pact-tree-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, Vflow, PactNodeComponent],
  templateUrl: './pact-tree-editor.component.html',
  styleUrl: './pact-tree-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PactTreeEditorComponent {
  // Tree-level metadata, kept separate from the node list itself
  treeName = signal('My Pact Tree');
  treeDescription = signal('');
  maxPoints = signal(40);
  maxResets = signal(6);

  // All pacts in the tree, as editor-local state
  pacts = signal<EditablePact[]>([
    createEmptyPact('fury-root', 0, 200),
    createEmptyPact('precision-root', 250, 0),
    createEmptyPact('shadows-root', 250, 400),
  ]);

  selectedPactId = signal<string | null>(null);

  selectedPact = computed(() => this.pacts().find((p) => p.id === this.selectedPactId()) ?? null);

  // ---- ngx-vflow inputs, derived from `pacts` ----
  nodes = signal<Node[]>([
    {
      id: 'node-1',
      type: 'default',
      point: signal({ x: 100, y: 100 })
    },
    {
      id: 'node-2',
      type: 'default',
      point: signal({ x: 400, y: 150 })
    }
  ]);

  // Connect the nodes using an edge path
  public edges = signal<Edge[]>([
    {
      id: 'edge-1-2',
      source: 'node-1',
      target: 'node-2',
      type: 'default'
    }
  ]);

  // computed<Node[]>(() =>
  //   this.pacts().map((pact) => ({
  //     id: pact.id,
  //     point: { x: pact.x, y: pact.y },
  //     type: 'component',
  //     component: PactNodeComponent,
  //     data: { pact, isSelected: pact.id === this.selectedPactId() },
  //     width: 150,
  //     height: 60,
  //     draggable: true,
  //     resizable: false,
  //     removable: true,
  //     connectable: true,
  //     connectors: pact.connections.map((c) => ({ id: `${pact.id}::${c}`, target: c })),
  //   })),
  // );

  // edges = computed<Edge[]>(() => {
  //   const seen = new Set<string>();
  //   const result: Edge[] = [];
  //   for (const pact of this.pacts()) {
  //     for (const targetId of pact.connections) {
  //       const key = [pact.id, targetId].sort().join('::');
  //       if (seen.has(key)) continue;
  //       seen.add(key);
  //       result.push(createEdge({ id: key, source: pact.id, target: targetId }));
  //     }
  //   }
  //   return result;
  // });

  // ---- Mutating the tree ----

  addPact(): void {
    const id = crypto.randomUUID();
    const existing = this.pacts();
    // Drop the new node a bit to the right of whatever was added last, so the
    // canvas doesn't stack everything at the origin.
    const last = existing[existing.length - 1];
    this.pacts.set([...existing, createEmptyPact(id, (last?.x ?? 0) + 180, (last?.y ?? 0))]);
    this.selectedPactId.set(id);
  }

  removeSelectedPact(): void {
    const id = this.selectedPactId();
    if (!id) return;
    this.pacts.update((pacts) =>
      pacts
        .filter((p) => p.id !== id)
        .map((p) => ({ ...p, connections: p.connections.filter((c) => c !== id) })),
    );
    this.selectedPactId.set(null);
  }

  selectPact(id: string): void {
    this.selectedPactId.set(id);
  }

  toggleAllocated(id: string): void {
    this.pacts.update((pacts) => {
      const target = pacts.find((p) => p.id === id);
      if (!target) return pacts;

      // Allow deallocating freely, but only allow allocating if it's a root
      // or connects to an already-allocated pact — mirrors the in-game rule
      // that you must path into a node from something you've already taken.
      if (!target.allocated) {
        const allocatedIds = new Set(pacts.filter((p) => p.allocated).map((p) => p.id));
        const reachable = target.isRoot || target.connections.some((c) => allocatedIds.has(c));
        if (!reachable) return pacts;
      }

      return pacts.map((p) => (p.id === id ? { ...p, allocated: !p.allocated } : p));
    });
  }

  updateSelectedPact(patch: Partial<EditablePact>): void {
    const id = this.selectedPactId();
    if (!id) return;
    this.pacts.update((pacts) => pacts.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  addEffectToSelected(): void {
    const pact = this.selectedPact();
    if (!pact) return;
    this.updateSelectedPact({ effects: [...pact.effects, ''] });
  }

  updateEffect(index: number, value: string): void {
    const pact = this.selectedPact();
    if (!pact) return;
    const effects = [...pact.effects];
    effects[index] = value;
    this.updateSelectedPact({ effects });
  }

  removeEffect(index: number): void {
    const pact = this.selectedPact();
    if (!pact) return;
    this.updateSelectedPact({ effects: pact.effects.filter((_, i) => i !== index) });
  }

  // ---- ngx-vflow event handlers ----

  /** Fired by ngx-vflow when the user drags a connection from one handle to another */
  onConnect(connection: Connection): void {
    this.pacts.update((pacts) =>
      pacts.map((p) => {
        if (p.id === connection.source && !p.connections.includes(connection.target)) {
          return { ...p, connections: [...p.connections, connection.target] };
        }
        if (p.id === connection.target && !p.connections.includes(connection.source)) {
          return { ...p, connections: [...p.connections, connection.source] };
        }
        return p;
      }),
    );
  }

  /** Fired by ngx-vflow on node drag end — persist the new position */
  onNodeDragEnd(nodeId: string, point: { x: number; y: number }): void {
    this.pacts.update((pacts) =>
      pacts.map((p) => (p.id === nodeId ? { ...p, x: point.x, y: point.y } : p)),
    );
  }

  // ---- Save / load ----

  exportTree(): PactTree {
    return toPactTree(
      {
        id: crypto.randomUUID(),
        name: this.treeName(),
        description: this.treeDescription(),
        maxPoints: this.maxPoints(),
        maxResets: this.maxResets(),
      },
      this.pacts(),
    );
  }

  loadTree(tree: PactTree): void {
    this.treeName.set(tree.name);
    this.treeDescription.set(tree.description ?? '');
    this.maxPoints.set(tree.maxPoints);
    this.maxResets.set(tree.maxResets ?? 6);
    this.pacts.set(fromPactTree(tree));
    this.selectedPactId.set(null);
  }
}
