import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentExampleDialog5Component } from './dialog-content-example-dialog5.component';

describe('DialogContentExampleDialog5Component', () => {
  let component: DialogContentExampleDialog5Component;
  let fixture: ComponentFixture<DialogContentExampleDialog5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentExampleDialog5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentExampleDialog5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
