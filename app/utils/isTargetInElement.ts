export const isTargetInElement = (
  element: Node,
  target: EventTarget,
): boolean => {
  return element.contains(target as Node);
};
