import { RefundService } from './../../service/refund/refund.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { Refund } from '../../model/refund';
import { MatSort, Sort } from '@angular/material/sort';
import { RefundStorage } from '../../storage/refund.storage';
import { TranslationService } from '../../service/translation.service';

@Component({
  selector: 'app-refund-component',
  templateUrl: './refund.component.html',
  styleUrl: './refund.component.css'
})
export class RefundComponent implements AfterViewInit{
  
  displayedColumns: string[] = [//'select'
  //, 'idrefund'
   'name_payer'//,  'idbalance_payer'//, 'balance_payer'//, 'amount_payer', 'free_payer', 'positive_balance_payer'
  , 'amount'
  //, 'currentBalance'
  , 'name_payee'//,  'idbalance_payee'
  //, 'current_balance_payer', 'current_balance_payee'//, 'balance_payee'//, 'amount_payee', 'free_payee', 'positive_balance_payee'
];
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public refundStorage: RefundStorage,
    public refundService: RefundService,
    public translation: TranslationService
    ){
      this.refundStorage.loadData();
  }
  
  @ViewChild(MatSort)
  sort!: MatSort;
  ngAfterViewInit(): void {
    this.refundStorage.refund_dataSource().sort = this.sort;
  }
 
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.refundStorage.refund_selection().selected.length;
    const numRows = this.refundStorage.refund_dataToDisplay().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.refundStorage.refund_selection().clear();
      return;
    }

    this.refundStorage.refund_selection().select(...this.refundStorage.refund_dataToDisplay());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Refund): string {
    if (!row) {
      return `${this.isAllSelected() ? this.translation.translate('deselect') : this.translation.translate('select')} ${this.translation.translate('all')}`;
    }
    return `${this.refundStorage.refund_selection().isSelected(row) ? this.translation.translate('deselect') : this.translation.translate('select')} ${this.translation.translate('row')} ${row.idrefund + 1}`;
  }

  totalAmount(): string|number {
    return this.refundService.totalAmount();
  }
  
}
