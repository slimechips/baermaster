import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: RequestUploadComponent;
  let fixture: ComponentFixture<RequestUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
