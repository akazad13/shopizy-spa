import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AdminCategoriesComponent } from './admin-categories.component';
import { CategoryApi } from '../../../api/category.api';
import { ToastService } from '../../../services/toast.service';

describe('AdminCategoriesComponent', () => {
  let component: AdminCategoriesComponent;
  let fixture: ComponentFixture<AdminCategoriesComponent>;
  let categoryApiMock: jasmine.SpyObj<CategoryApi>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    categoryApiMock = jasmine.createSpyObj('CategoryApi', [
      'getCategories',
      'createCategory',
      'updateCategory',
      'deleteCategory'
    ]);
    toastServiceMock = jasmine.createSpyObj('ToastService', [
      'success',
      'error'
    ]);

    categoryApiMock.getCategories.and.returnValue(of([]));
    categoryApiMock.createCategory.and.returnValue(of({ id: '1' }));
    categoryApiMock.updateCategory.and.returnValue(of({ message: 'ok' }));
    categoryApiMock.deleteCategory.and.returnValue(of({ message: 'ok' }));

    await TestBed.configureTestingModule({
      imports: [AdminCategoriesComponent],
      providers: [
        { provide: CategoryApi, useValue: categoryApiMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and compute top-level count', () => {
    categoryApiMock.getCategories.and.returnValue(
      of([
        { id: '1', name: 'Men', parentId: null },
        { id: '2', name: 'Shoes', parentId: '1' }
      ] as any)
    );

    component.loadCategories();

    expect(component.categories.length).toBe(2);
    expect(component.topLevelCategories).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should normalize wrapped categories response', () => {
    categoryApiMock.getCategories.and.returnValue(
      of({
        items: { $values: [{ id: '1', name: 'Men', parentId: null }] }
      } as any)
    );

    component.loadCategories();

    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Men');
  });

  it('should show error toast when load fails', () => {
    categoryApiMock.getCategories.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.loadCategories();

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Failed to load categories'
    );
    expect(component.loading).toBeFalse();
  });

  it('onAdd should reset and show form', () => {
    component.isEditMode = true;
    component.categoryForm = {
      id: '1',
      name: 'Old',
      description: 'Old desc',
      parentId: null
    };

    component.onAdd();

    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeFalse();
    expect(component.categoryForm).toEqual({
      id: '',
      name: '',
      description: '',
      parentId: null
    });
  });

  it('onEdit should populate form and set edit mode', () => {
    component.onEdit({
      id: '2',
      name: 'Shoes',
      description: 'Desc',
      parentId: '1'
    });

    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.categoryForm.id).toBe('2');
    expect(component.categoryForm.name).toBe('Shoes');
  });

  it('buildTree should nest children under parents', () => {
    component.categories = [
      { id: '1', name: 'Men', parentId: null },
      { id: '2', name: 'Shoes', parentId: '1' }
    ] as any;

    component.buildTree();

    expect(component.categoryTree.length).toBe(1);
    expect(component.categoryTree[0].children.length).toBe(1);
    expect(component.categoryTree[0].children[0].name).toBe('Shoes');
  });

  it('toggleExpanded should flip expanded state', () => {
    const node = { expanded: false } as any;

    component.toggleExpanded(node);
    expect(node.expanded).toBeTrue();

    component.toggleExpanded(node);
    expect(node.expanded).toBeFalse();
  });

  it('onSubmit should create category in create mode', () => {
    spyOn(component, 'loadCategories');
    component.categoryForm = {
      id: '',
      name: 'Shoes',
      description: 'Desc',
      parentId: null
    };

    component.onSubmit();

    expect(categoryApiMock.createCategory).toHaveBeenCalledWith({
      name: 'Shoes',
      description: 'Desc',
      parentId: null
    });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Category created');
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it('onSubmit should update category in edit mode', () => {
    spyOn(component, 'loadCategories');
    component.isEditMode = true;
    component.categoryForm = {
      id: 'cat-1',
      name: 'Shoes',
      description: 'Desc',
      parentId: null
    };

    component.onSubmit();

    expect(categoryApiMock.updateCategory).toHaveBeenCalledWith('cat-1', {
      name: 'Shoes',
      description: 'Desc',
      parentId: null
    });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Category updated');
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it('onSubmit should do nothing when name is missing', () => {
    component.categoryForm.name = '';

    component.onSubmit();

    expect(categoryApiMock.createCategory).not.toHaveBeenCalled();
    expect(categoryApiMock.updateCategory).not.toHaveBeenCalled();
  });

  it('onDelete should not call api when confirmation is cancelled', () => {
    component.onDelete('cat-1');
    component.cancelDeleteCategory();

    expect(categoryApiMock.deleteCategory).not.toHaveBeenCalled();
  });

  it('onDelete should delete and reload when confirmed', () => {
    spyOn(component, 'loadCategories');

    component.onDelete('cat-1');
    component.confirmDeleteCategory();

    expect(categoryApiMock.deleteCategory).toHaveBeenCalledWith('cat-1');
    expect(toastServiceMock.success).toHaveBeenCalledWith('Category deleted');
    expect(component.loadCategories).toHaveBeenCalled();
  });

  it('onDelete should show error toast on failure', () => {
    categoryApiMock.deleteCategory.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.onDelete('cat-1');
    component.confirmDeleteCategory();

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Error deleting category'
    );
  });
});
