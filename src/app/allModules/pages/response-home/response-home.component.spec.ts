import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseHomeComponent } from './response-home.component';

describe('ResponseHomeComponent', () => {
  let component: ResponseHomeComponent;
  let fixture: ComponentFixture<ResponseHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
