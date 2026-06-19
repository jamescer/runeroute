import type { Pact, PactTree } from 'osrs-tools';

/**
 * The editor's working representation of a Pact. Extends the published
 * `Pact` type with UI-only concerns (canvas position, allocation state
 * for previewing a build, root flag) that have no business in the
 * package's public interface. Convert down to `Pact[]` on save.
 */
export interface EditablePact extends Pact {
  x: number;
  y: number;
  isRoot: boolean;
  /** Local-only: lets the editor preview a build without a separate PactBuild flow */
  allocated: boolean;
}

export function createEmptyPact(id: string, x: number, y: number): EditablePact {
  return {
    id,
    name: '',
    description: '',
    effects: [],
    cost: 1,
    connections: [],
    type: 'node',
    path: undefined,
    x,
    y,
    isRoot: false,
    allocated: false,
  };
}

/** Convert editor state -> the package's public PactTree shape for saving/export */
export function toPactTree(
  treeMeta: { id: string; name: string; description?: string; maxPoints: number; maxResets?: number },
  pacts: EditablePact[],
): PactTree {
  return {
    ...treeMeta,
    roots: pacts.filter((p) => p.isRoot).map((p) => p.id),
    pacts: pacts.map(({ x, y, isRoot, allocated, ...pact }) => ({
      ...pact,
      position: { x, y },
    })),
  };
}

/** Convert a saved PactTree back into editable state, e.g. when loading an existing tree */
export function fromPactTree(tree: PactTree): EditablePact[] {
  const rootIds = new Set(tree.roots);
  return tree.pacts.map((pact) => ({
    ...pact,
    x: pact.position?.x ?? 0,
    y: pact.position?.y ?? 0,
    isRoot: rootIds.has(pact.id),
    allocated: false,
  }));
}
