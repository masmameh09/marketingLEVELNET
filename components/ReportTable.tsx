
import React from 'react';
import type { VisitReport } from '../types';
import { Card } from './ui/Card';

interface ReportTableProps {
  reports: VisitReport[];
  showSalesColumn: boolean;
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports, showSalesColumn }) => {
  if (reports.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada data laporan untuk ditampilkan.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {showSalesColumn && <th scope="col" className="px-6 py-3">Sales</th>}
            <th scope="col" className="px-6 py-3">Tanggal & Waktu</th>
            <th scope="col" className="px-6 py-3">Nama Pelanggan</th>
            <th scope="col" className="px-6 py-3">Tingkat Minat</th>
            <th scope="col" className="px-6 py-3">No. HP</th>
            <th scope="col" className="px-6 py-3">Lokasi (Lat, Lon)</th>
            <th scope="col" className="px-6 py-3">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              {showSalesColumn && <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{report.salesPerson.name}</td>}
              <td className="px-6 py-4">{new Date(report.timestamp).toLocaleString('id-ID')}</td>
              <td className="px-6 py-4">{report.customerName}</td>
              <td className="px-6 py-4">{report.interestLevel}</td>
              <td className="px-6 py-4">{report.phoneNumber || '-'}</td>
              <td className="px-6 py-4">{`${report.location.latitude.toFixed(5)}, ${report.location.longitude.toFixed(5)}`}</td>
              <td className="px-6 py-4 max-w-xs truncate" title={report.notes}>{report.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
