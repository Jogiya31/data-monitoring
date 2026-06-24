import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardsSection } from '../../components/cards-section/cards-section';
import { DataTableComponent } from '../../components/data-table/data-table';
import { escapeHtml, UiService } from '../../services/ui.service';

interface ReportItem {
  id: string;
  name: string;
  selected?: boolean;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CardsSection, DataTableComponent],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class ReportsComponent implements OnInit {
  dynamicTableData: any[] = [];
  dynamicTableColumns: any[] = [];
  selectedOption: any = {};
  searchText = '';
  selectAll = false;

  escapeHtml = escapeHtml;

  constructor(private ui: UiService) {
    this.escapeHtml = this.ui.escapeHtml;
  }

  reportList: ReportItem[] = [
    { id: 'complete-delay', name: 'Complete Delay Report' },
    { id: 'critical-delay', name: 'Critical Delay Report' },
    { id: 'pragati-delay', name: 'Pragati Delay Report' },
    { id: 'grace-period', name: 'Grace Period Report' },
    { id: 'outside-grace', name: 'Outside Grace Period Report' },
    { id: 'top-performer', name: 'Top Performer Report' },
    { id: 'top-defaulter', name: 'Top Defaulter Report' },
    { id: 'consec-performer', name: 'Top 5 Consecutive Performer Report' },
    { id: 'consec-defaulter', name: 'Top 5 Consecutive Defaulter Report' },
    { id: 'dept-performance', name: 'Department Performance Report' },
    { id: 'ministry-performance', name: 'Ministry Performance Report' },
    { id: 'state-performance', name: 'State Performance Report' },
    { id: 'district-performance', name: 'District Performance Report' },
    { id: 'anomaly-summary', name: 'Anomaly Summary Report' },
    { id: 'exec-monthly', name: 'Monthly Executive Report' },
    { id: 'exec-quarterly', name: 'Quarterly Executive Report' },
    { id: 'exec-yearly', name: 'Yearly Executive Report' },
  ];

  ngOnInit(): void {
    this.loadReport(this.reportList[0]);
  }

  get filteredReports() {
    return this.reportList.filter((r) =>
      r.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  get selectedCount(): number {
    return this.reportList.filter((x) => x.selected).length;
  }

  toggleSelectAll() {
    this.reportList.forEach((r) => (r.selected = this.selectAll));
  }

  onSelectionChange() {
    this.selectAll = this.reportList.length > 0 && this.reportList.every((r) => r.selected);
  }

  loadReport(report: ReportItem) {
    // API Call Here
    this.selectedOption = report;

    console.log('report', report);
  }

  handleExcel() {
    const selected = this.reportList.filter((x) => x.selected);

    console.log('Export Excel', selected);
  }

  handleCSV() {
    const selected = this.reportList.filter((x) => x.selected);

    console.log('Export CSV ZIP', selected);
  }

  handleDownloadAll() {
    console.log('Download all reports');
  }
}
