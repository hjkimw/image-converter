export function reorderById(ids: string[], sourceId: string, targetId: string) {
  const sourceIndex = ids.indexOf(sourceId);
  const targetIndex = ids.indexOf(targetId);

  if (sourceIndex === -1 || targetIndex === -1 || sourceId === targetId) {
    return ids;
  }

  const next = [...ids];
  const [source] = next.splice(sourceIndex, 1);
  const nextTargetIndex = next.indexOf(targetId);

  next.splice(nextTargetIndex, 0, source);

  return next;
}

export function reorderItemsById<T extends { id: string }>(items: T[], sourceId: string, targetId: string) {
  const reorderedIds = reorderById(
    items.map((item) => item.id),
    sourceId,
    targetId,
  );
  const itemById = new Map(items.map((item) => [item.id, item]));

  return reorderedIds.map((id) => itemById.get(id)).filter(Boolean) as T[];
}
