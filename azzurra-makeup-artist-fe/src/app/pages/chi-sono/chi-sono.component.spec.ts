import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiSonoComponent } from './chi-sono.component';

describe('ChiSonoComponent', () => {
  let component: ChiSonoComponent;
  let fixture: ComponentFixture<ChiSonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChiSonoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiSonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
