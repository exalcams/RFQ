import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentExampleDialog2Component } from './dialog-content-example-dialog2.component';

describe('DialogContentExampleDialog2Component', () => {
  let component: DialogContentExampleDialog2Component;
  let fixture: ComponentFixture<DialogContentExampleDialog2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentExampleDialog2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentExampleDialog2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
