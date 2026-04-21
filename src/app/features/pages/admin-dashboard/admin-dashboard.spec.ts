import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardPage } from './admin-dashboard';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http_testing';
import { ActivatedRoute } from '@angular/router';

describe('AdminDashboardPage', () => {
  let component: AdminDashboardPage;
  let fixture: ComponentFixture<AdminDashboardPage>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'adminStats', 'adminUsers', 'adminProfessionals', 
      'adminReports', 'adminSubscriptionRequests', 'categories',
      'leads', 'adminAudits', 'adminUpdateUserStatus', 'adminDeleteUser'
    ]);
    const toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    const seoSpy = jasmine.createSpyObj('SeoService', ['setTitle', 'updateTags']);

    apiSpy.adminStats.and.returnValue(of({}));
    apiSpy.adminUsers.and.returnValue(of({ items: [] }));
    apiSpy.adminProfessionals.and.returnValue(of({ items: [] }));
    apiSpy.adminReports.and.returnValue(of({ items: [] }));
    apiSpy.adminSubscriptionRequests.and.returnValue(of([]));
    apiSpy.categories.and.returnValue(of([]));
    apiSpy.leads.and.returnValue(of({ items: [] }));
    apiSpy.adminAudits.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AdminDashboardPage],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: SeoService, useValue: seoSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardPage);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch tabs and reload data', () => {
    component.activeTab = 'leads';
    component.reload();
    expect(apiService.leads).toHaveBeenCalled();
  });

  it('should handle user status update', () => {
    const mockUser = { _id: '123', name: 'Test User' };
    apiService.adminUpdateUserStatus.and.returnValue(of({}));
    component.setUserStatus(mockUser, 'inactive');
    expect(apiService.adminUpdateUserStatus).toHaveBeenCalledWith('123', { status: 'inactive' });
    expect(toastService.success).toHaveBeenCalled();
  });

  it('should handle lead deletion', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockLead = { _id: 'L1' };
    apiService.deleteLead = jasmine.createSpy().and.returnValue(of({}));
    component.deleteLead(mockLead);
    expect(apiService.deleteLead).toHaveBeenCalledWith('L1');
  });

  it('should apply email templates', () => {
    component.selectedTemplateId = 'welcome';
    component.applyTemplate('single');
    expect(component.emailSubject).toBe('Bienvenue sur La STREET !');
    expect(component.emailMessage).toContain('Bienvenue dans notre communauté');
  });
});
