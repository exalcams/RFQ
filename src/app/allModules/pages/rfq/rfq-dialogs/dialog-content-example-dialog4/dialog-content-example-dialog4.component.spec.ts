import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentExampleDialog4Component } from './dialog-content-example-dialog4.component';

describe('DialogContentExampleDialog4Component', () => {
  let component: DialogContentExampleDialog4Component;
  let fixture: ComponentFixture<DialogContentExampleDialog4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentExampleDialog4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentExampleDialog4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
