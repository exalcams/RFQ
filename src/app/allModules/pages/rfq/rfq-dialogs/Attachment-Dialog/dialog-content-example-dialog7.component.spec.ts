import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentExampleDialog7Component } from './dialog-content-example-dialog7.component';

describe('DialogContentExampleDialog7Component', () => {
  let component: DialogContentExampleDialog7Component;
  let fixture: ComponentFixture<DialogContentExampleDialog7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentExampleDialog7Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentExampleDialog7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
