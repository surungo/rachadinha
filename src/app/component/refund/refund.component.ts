import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { Refund } from '../../model/refund';
import { MatSort, Sort } from '@angular/material/sort';
import { BusinessService } from '../../service/business.service';

@Component({
  selector: 'app-refund-component',
  templateUrl: './refund.component.html',
  styleUrl: './refund.component.css'
})
export class RefundComponent implements AfterViewInit{
  
  displayedColumns: string[] = ['select'
  , 'name_payer', 'balance_payer'//, 'amount_payer', 'free_payer', 'positive_balance_payer',  'idplayer_payer'
  , 'amount'
  , 'name_payee', 'balance_payee'//, 'amount_payee', 'free_payee', 'positive_balance_payee',  'idplayer_payee'
];
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public businessService: BusinessService
    ){
  }
  
  @ViewChild(MatSort)
  sort!: MatSort;
  ngAfterViewInit(): void {
    this.businessService.balance_dataSource().sort = this.sort;
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
    const numSelected = this.businessService.refund_selection().selected.length;
    const numRows = this.businessService.refund_dataToDisplay().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.businessService.refund_selection().clear();
      return;
    }

    this.businessService.refund_selection().select(...this.businessService.refund_dataToDisplay());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Refund): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.businessService.refund_selection().isSelected(row) ? 'deselect' : 'select'} row ${row.idrefund + 1}`;
  }
  
}
