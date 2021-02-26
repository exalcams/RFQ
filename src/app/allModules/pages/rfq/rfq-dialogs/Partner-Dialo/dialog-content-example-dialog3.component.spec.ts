import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentExampleDialog3Component } from './dialog-content-example-dialog3.component';

describe('DialogContentExampleDialog3Component', () => {
  let component: DialogContentExampleDialog3Component;
  let fixture: ComponentFixture<DialogContentExampleDialog3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentExampleDialog3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentExampleDialog3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
