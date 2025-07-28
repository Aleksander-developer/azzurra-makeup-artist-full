// src/app/admin/portfolio-manager/portfolio-manager.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PortfolioImage, PortfolioItem } from '../../pages/portfolio/portfolio-item.model';

// Importa $localize
declare const $localize: any;

@Component({
  selector: 'app-admin-portfolio-manager',
  templateUrl: './portfolio-manager.component.html',
  styleUrls: ['./portfolio-manager.component.scss']
})
export class AdminPortfolioManagerComponent implements OnInit, OnDestroy {
  portfolioForm!: FormGroup;
  portfolioItems: PortfolioItem[] = [];
  editingItem: PortfolioItem | null = null;

  allImagePreviews: (string | ArrayBuffer | null)[] = [];

  loading = false;
  isUploading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  displayedColumns: string[] = ['title', 'category', 'actions'];

  @ViewChild('galleryFileInput') galleryFileInput!: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // Inietta PLATFORM_ID
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPortfolioItems();
  }

  ngOnDestroy(): void {
    // Nessuna sottoscrizione da disiscrivere manualmente se usi takeUntil o async pipe
  }

  initForm(): void {
    this.portfolioForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      description: [''],
      category: ['', Validators.required],
      images: this.fb.array([])
    });
    console.log('Form inizializzato. imagesFormArray length:', this.imagesFormArray.length);
  }

  get imagesFormArray(): FormArray {
    return this.portfolioForm.get('images') as FormArray;
  }

  createImageGroup(image?: PortfolioImage, file?: File): FormGroup {
    console.log('Creazione FormGroup per immagine:', image, 'File:', file);
    return this.fb.group({
      src: [image ? image.src : undefined],
      description: [image ? image.description : ''],
      alt: [image ? image.alt : ''],
      isNew: [image ? false : true],
      file: [file]
    });
  }

  // Getter per il titolo del form (Aggiungi/Modifica)
  get formTitle(): string {
    return this.editingItem
      ? $localize`:@@adminPortfolioManagerFormEditTitle:Modifica Lavoro`
      : $localize`:@@adminPortfolioManagerFormAddTitle:Aggiungi Nuovo Lavoro`;
  }

  // Getter per il testo del pulsante di submit
  get submitButtonLabel(): string {
    return this.editingItem
      ? $localize`:@@adminPortfolioManagerSaveChangesButton:Salva Modifiche`
      : $localize`:@@adminPortfolioManagerAddWorkButton:Aggiungi Lavoro`;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newSelectedFiles = Array.from(input.files);

      const currentFormImages: { imageGroup: FormGroup, preview: string | ArrayBuffer | null }[] = [];
      this.imagesFormArray.controls.forEach((control, index) => {
        currentFormImages.push({
          imageGroup: control as FormGroup,
          preview: this.allImagePreviews[index]
        });
      });

      const maxNewFilesToAdd = 10 - currentFormImages.length;
      const filesToActuallyAdd = newSelectedFiles.slice(0, maxNewFilesToAdd);

      if (filesToActuallyAdd.length === 0 && currentFormImages.length >= 10) {
        if (isPlatformBrowser(this.platformId)) { // Protezione SSR
          this.snackBar.open($localize`:@@adminPortfolioManagerMaxImagesWarning:Massimo 10 immagini consentite per portfolio.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
        }
        return;
      }

      this.imagesFormArray.clear();
      this.allImagePreviews = [];

      currentFormImages.forEach(item => {
        this.imagesFormArray.push(item.imageGroup);
        this.allImagePreviews.push(item.preview);
      });

      filesToActuallyAdd.forEach((file) => {
        this.imagesFormArray.push(this.createImageGroup(undefined, file));
        this.allImagePreviews.push(null);
      });

      this.cdr.detectChanges();
      console.log(`Tutti i FormGroups (esistenti + nuovi) aggiunti. Change detection forzata.`);
      console.log('imagesFormArray length dopo selezione file:', this.imagesFormArray.length);

      this.imagesFormArray.controls.forEach((control, index) => {
        const formGroupValue = control.value;
        if (formGroupValue.isNew && formGroupValue.file instanceof File && this.allImagePreviews[index] === null) {
          const file = formGroupValue.file;
          const reader = new FileReader();
          reader.onload = () => {
            this.allImagePreviews[index] = reader.result;
            this.cdr.detectChanges();
            console.log(`Anteprima caricata per indice ${index}`);
          };
          reader.readAsDataURL(file);
        }
      });

      console.log('File selezionati per la galleria (totali):', newSelectedFiles.map(f => f.name));
    }
    if (input && isPlatformBrowser(this.platformId)) { // Protezione SSR
      input.value = '';
    }
  }


  removeImage(index: number): void {
    console.log('Tentativo di rimuovere immagine all\'indice:', index);
    if (index >= 0 && index < this.imagesFormArray.length) {
      this.imagesFormArray.removeAt(index);

      if (index < this.allImagePreviews.length) {
        this.allImagePreviews.splice(index, 1);
      }

      this.cdr.detectChanges();
      console.log('Immagine rimossa all\'indice:', index);
      console.log('imagesFormArray length dopo remove:', this.imagesFormArray.length);
      console.log('allImagePreviews length dopo remove:', this.allImagePreviews.length);
    } else {
      console.warn('Tentativo di rimuovere un\'immagine con indice non valido:', index);
    }
  }

  loadPortfolioItems(): void {
    this.loading = true;
    this.errorMessage = null;
    this.portfolioService.getPortfolioItems().subscribe({
      next: (items) => {
        this.portfolioItems = items.map(item => ({
          ...item,
          coverImageUrl: this.getPrecalculatedCoverImage(item)
        }));
        this.loading = false;
      },
      error: (err) => {
        if (isPlatformBrowser(this.platformId)) { // Protezione SSR
          this.snackBar.open($localize`:@@adminPortfolioManagerLoadError:Errore nel caricamento degli elementi del portfolio.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
        }
        console.error('Errore nel caricamento portfolio:', err);
        this.loading = false;
        this.errorMessage = $localize`:@@adminPortfolioManagerLoadErrorMessage:Errore nel caricamento: ${err.message || 'Errore sconosciuto.'}`;
      }
    });
  }

  private getPrecalculatedCoverImage(item: PortfolioItem): string {
    if (item.images && item.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * item.images.length);
      return item.images[randomIndex].src || 'assets/placeholder.jpg';
    }
    return 'assets/placeholder.jpg';
  }


  editItem(item: PortfolioItem): void {
    console.log('Inizio editing per elemento:', item.id);
    this.editingItem = item;
    this.portfolioForm.patchValue({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      category: item.category
    });

    this.imagesFormArray.clear();
    this.allImagePreviews = [];

    console.log('FormArray e array immagini resettati per editing.');

    item.images.forEach(img => {
      console.log('Aggiunta immagine esistente in editing:', img);
      this.imagesFormArray.push(this.createImageGroup({
        src: img.src,
        description: img.description,
        alt: img.alt,
        isNew: false
      }, undefined));
      this.allImagePreviews.push(img.src || null);
    });

    console.log('imagesFormArray length dopo popolamento editing:', this.imagesFormArray.length);
    console.log('allImagePreviews length dopo popolamento editing:', this.allImagePreviews.length);

    this.cdr.detectChanges();
  }

  clearForm(): void {
    console.log('Resetting form...');
    this.portfolioForm.reset();
    this.editingItem = null;
    this.imagesFormArray.clear();
    this.allImagePreviews = [];
    if (this.galleryFileInput && isPlatformBrowser(this.platformId)) { // Protezione SSR
      this.galleryFileInput.nativeElement.value = '';
    }
    if (isPlatformBrowser(this.platformId)) { // Protezione SSR
      this.snackBar.open($localize`:@@adminPortfolioManagerFormReset:Form resettato.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 2000 });
    }
    this.errorMessage = null;
    this.successMessage = null;
    console.log('Form resettato completamente.');
  }

  async onSubmit(): Promise<void> {
    console.log('Submit del form avviato.');
    this.portfolioForm.markAllAsTouched();

    if (this.portfolioForm.invalid) {
      if (isPlatformBrowser(this.platformId)) { // Protezione SSR
        this.snackBar.open($localize`:@@adminPortfolioManagerFormInvalid:Per favor, compila tutti i campi obbligatori.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
      }
      console.warn('Form non valido al submit.');
      return;
    }

    const newFilesToUpload: File[] = [];
    const imagesMetadataToSend: PortfolioImage[] = [];

    this.imagesFormArray.controls.forEach(control => {
      const formGroupValue = control.value;
      const file = formGroupValue.file;

      if (formGroupValue.isNew && file instanceof File) {
        newFilesToUpload.push(file);
        imagesMetadataToSend.push({
          src: undefined, // Sarà popolato dopo l'upload
          description: formGroupValue.description,
          alt: formGroupValue.alt,
          isNew: true,
          file: file // Mantieni il riferimento al file per l'upload
        });
      } else {
        imagesMetadataToSend.push({
          src: formGroupValue.src,
          description: formGroupValue.description,
          alt: formGroupValue.alt,
          isNew: false
        });
      }
    });

    if (imagesMetadataToSend.length === 0 && !this.editingItem) {
      this.errorMessage = $localize`:@@adminPortfolioManagerNoImagesError:Devi aggiungere almeno un'immagine al portfolio.`;
      if (isPlatformBrowser(this.platformId)) { // Protezione SSR
        this.snackBar.open(this.errorMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
      }
      return;
    }

    this.loading = true;
    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const itemData = this.portfolioForm.value;

    console.log('Dati del form da inviare:', itemData);
    console.log('Metadati immagini da inviare:', imagesMetadataToSend);
    console.log('Nuovi file da caricare:', newFilesToUpload.map(f => f.name));


    try {
      if (this.editingItem) {
        console.log('Aggiornamento elemento portfolio esistente:', this.editingItem.id);
        await this.portfolioService.updatePortfolioItem(
          this.editingItem.id!,
          itemData,
          newFilesToUpload,
          imagesMetadataToSend
        ).toPromise();
        this.successMessage = $localize`:@@adminPortfolioManagerUpdateSuccess:Elemento portfolio aggiornato con successo!`;
        if (isPlatformBrowser(this.platformId)) { // Protezione SSR
          this.snackBar.open(this.successMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
        }
        console.log('Elemento portfolio aggiornato con successo!');
      } else {
        console.log('Aggiunta nuovo elemento portfolio.');
        if (newFilesToUpload.length === 0) {
          this.errorMessage = $localize`:@@adminPortfolioManagerNoNewImagesError:Devi selezionare almeno un'immagine per un nuovo elemento.`;
          if (isPlatformBrowser(this.platformId)) { // Protezione SSR
            this.snackBar.open(this.errorMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
          }
          this.loading = false;
          this.isUploading = false;
          console.error('Nessuna immagine selezionata per nuovo elemento.');
          return;
        }
        await this.portfolioService.addPortfolioItem(
          itemData,
          newFilesToUpload,
          imagesMetadataToSend
        ).toPromise();
        this.successMessage = $localize`:@@adminPortfolioManagerAddSuccess:Elemento portfolio aggiunto con successo!`;
        if (isPlatformBrowser(this.platformId)) { // Protezione SSR
          this.snackBar.open(this.successMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
        }
        console.log('Elemento portfolio aggiunto con successo!');
      }
      this.clearForm();
      this.loadPortfolioItems();
    } catch (error: any) {
      this.errorMessage = $localize`:@@adminPortfolioManagerOperationError:Errore durante l'operazione sul portfolio: ${error.message || 'Errore sconosciuto.'}`;
      if (isPlatformBrowser(this.platformId)) { // Protezione SSR
        this.snackBar.open(this.errorMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 5000 });
      }
      console.error('Errore portfolio:', error);
    } finally {
      this.loading = false;
      this.isUploading = false;
      console.log('Operazione portfolio completata.');
    }
  }

  deleteItem(id: string): void {
    console.log('Tentativo di eliminare elemento con ID:', id);
    if (!id) {
      if (isPlatformBrowser(this.platformId)) { // Protezione SSR
        this.snackBar.open($localize`:@@adminPortfolioManagerInvalidIdError:Impossibile eliminare: ID elemento non valido.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
      }
      console.error('ID elemento non valido per l\'eliminazione:', id);
      return;
    }

    if (isPlatformBrowser(this.platformId)) { // Protezione SSR
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { message: $localize`:@@adminPortfolioManagerDeleteConfirm:Sei sicuro di voler eliminare questo elemento del portfolio?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          this.portfolioService.deletePortfolioItem(id).subscribe({
            next: () => {
              this.successMessage = $localize`:@@adminPortfolioManagerDeleteSuccess:Elemento portfolio eliminato con successo!`;
              if (isPlatformBrowser(this.platformId)) { // Protezione SSR
                this.snackBar.open(this.successMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
              }
              this.loadPortfolioItems();
              console.log('Elemento portfolio eliminato con successo!');
            },
            error: (err) => {
              this.errorMessage = $localize`:@@adminPortfolioManagerDeleteError:Errore durante l'eliminazione dell'elemento del portfolio: ${err.message || 'Errore sconosciuto.'}`;
              if (isPlatformBrowser(this.platformId)) { // Protezione SSR
                this.snackBar.open(this.errorMessage ?? '', $localize`:@@commonCloseButton:Chiudi`, { duration: 5000 });
              }
              console.error('Errore eliminazione portfolio:', err);
            },
            complete: () => {
              this.loading = false;
              console.log('Operazione di eliminazione completata.');
            }
          });
        }
      });
    }
  }

  trackByFn(index: number, item: AbstractControl): any {
    return index;
  }
}
