import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Balance } from '../../model/balance';
import { MatSort, Sort } from '@angular/material/sort';
import { BalanceService } from '../../service/balance.service';

@Component({
  selector: 'app-balance-component',
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css'
})
export class BalanceComponentComponent implements AfterViewInit {

  displayedColumns: string[] = ['select', 'name', 'amount', 'balance', 'current_balance', 'free', 'positive_balance', 'idbalance'];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public balanceService: BalanceService,
  ) {
    this.balanceService.loadData();
  }

  @ViewChild(MatSort)
  sort!: MatSort;
  ngAfterViewInit(): void {
    this.balanceService.balance_dataSource().sort = this.sort;
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
    const numSelected = this.balanceService.balance_selection().selected.length;
    const numRows = this.balanceService.balance_dataToDisplay().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.balanceService.balance_selection().clear();
      return;
    }

    this.balanceService.balance_selection().select(...this.balanceService.balance_dataToDisplay());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Balance): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.balanceService.balance_selection().isSelected(row) ? 'deselect' : 'select'} row ${row.idbalance + 1}`;
  }

}

