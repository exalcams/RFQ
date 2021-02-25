import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentExampleDialog1Component } from './dialog-content-example-dialog1.component';

describe('DialogContentExampleDialog1Component', () => {
  let component: DialogContentExampleDialog1Component;
  let fixture: ComponentFixture<DialogContentExampleDialog1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentExampleDialog1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentExampleDialog1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
