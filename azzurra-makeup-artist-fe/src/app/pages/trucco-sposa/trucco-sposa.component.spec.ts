import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruccoSposaComponent } from './trucco-sposa.component';

describe('TruccoSposaComponent', () => {
  let component: TruccoSposaComponent;
  let fixture: ComponentFixture<TruccoSposaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TruccoSposaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruccoSposaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
