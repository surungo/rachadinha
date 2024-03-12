import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Player } from '../../model/player';
import { MatSort, Sort } from '@angular/material/sort';
import { BusinessService } from '../../service/business.service';

@Component({
  selector: 'app-balance-component',
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css'
})
export class BalanceComponentComponent implements AfterViewInit{
  
  displayedColumns: string[] = ['select', 'name', 'amount', 'balance', 'current_balance', 'free', 'positive_balance',  'idplayer'];
  
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
    const numSelected = this.businessService.balance_selection().selected.length;
    const numRows = this.businessService.balance_dataToDisplay().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.businessService.balance_selection().clear();
      return;
    }

    this.businessService.balance_selection().select(...this.businessService.balance_dataToDisplay());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Player): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.businessService.balance_selection().isSelected(row) ? 'deselect' : 'select'} row ${row.idplayer + 1}`;
  }
  
}

