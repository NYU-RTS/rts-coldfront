import { Popover, Tooltip } from 'bootstrap';
import { getElementsByQueryGenerator } from './util';

function buildNativeHelpText(element: HTMLElement): string | null {
  const title = element.getAttribute('title') || element.dataset.bsTitle || '';
  const content = element.dataset.bsContent || '';

  if (title && content && title !== content) {
    return `${title}: ${content}`;
  }

  return content || title || null;
}

export function initBootstrap(): void {
  for (const element of getElementsByQueryGenerator(
    '[data-bs-toggle="tooltip"]'
  )) {
    const helpText = buildNativeHelpText(element);
    if (!helpText) {
      continue;
    }

    element.setAttribute('title', helpText);
    element.setAttribute('aria-label', helpText);
    Tooltip.getOrCreateInstance(element);
  }

  for (const element of getElementsByQueryGenerator(
    '[data-bs-toggle="popover"]'
  )) {
    const helpText = buildNativeHelpText(element);
    if (!helpText) {
      continue;
    }

    element.setAttribute('title', helpText);
    element.setAttribute('aria-label', helpText);
    Popover.getOrCreateInstance(element);
  }
}
