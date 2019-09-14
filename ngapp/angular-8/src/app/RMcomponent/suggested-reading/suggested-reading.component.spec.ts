import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedReadingComponent } from './suggested-reading.component';

describe('SuggestedReadingComponent', () => {
  let component: SuggestedReadingComponent;
  let fixture: ComponentFixture<SuggestedReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
