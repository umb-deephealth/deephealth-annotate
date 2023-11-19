import { CornerstoneDirective } from './cornerstone.directive';
import { ElementRef } from '@angular/core';

describe('CornerstoneDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef(document.createElement('div'));
    const directive = new CornerstoneDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
