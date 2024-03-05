import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { Player } from '../model/player';
import { FormControl } from '@angular/forms';
import {MatSort, Sort } from '@angular/material/sort';
import { BusinessService } from '../service/business.service';

@Component({
  selector: 'app-balance-component',
  templateUrl: './balance-component.component.html',
  styleUrl: './balance-component.component.css'
})
export class BalanceComponentComponent   implements AfterViewInit{
  
  displayedColumns: string[] = ['select',  'idplayer', 'name', 'amount', 'free', 'balance', 'positive_current_balance'];
  totalCurrentBalance = new FormControl(0);
  
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
    const numSelected = this.businessService.selection().selected.length;
    const numRows = this.businessService.balance_dataToDisplay().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.businessService.selection().clear();
      return;
    }

    this.businessService.selection().select(...this.businessService.balance_dataToDisplay());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Player): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.businessService.selection().isSelected(row) ? 'deselect' : 'select'} row ${row.idplayer + 1}`;
  }
  
}

