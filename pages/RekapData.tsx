
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getReports } from '../services/reportService';
import { User, VisitReport, UserRole } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ReportTable } from '../components/ReportTable';
import { getSalesUsers } from '../services/userService';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';

type FilterType = 'all' | 'daily' | 'weekly' | 'monthly';

const RekapData: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<VisitReport[]>([]);
  const [salesUsers, setSalesUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedSales, setSelectedSales] = useState<string>('all');
  
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
            const fetchedReports = await getReports(user);
            setReports(fetchedReports);
            if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
                setSalesUsers(getSalesUsers());
            }
        } catch(e) {
            console.error("Failed to load reports", e);
            setReports([]); // Set empty on error
        } finally {
            setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  const filteredReports = useMemo(() => {
    let dateFiltered = reports;

    const now = new Date();
    if (filter === 'daily') {
      const today = new Date(now.setHours(0, 0, 0, 0));
      dateFiltered = reports.filter(r => new Date(r.timestamp) >= today);
    } else if (filter === 'weekly') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      dateFiltered = reports.filter(r => new Date(r.timestamp) >= startOfWeek);
    } else if (filter === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFiltered = reports.filter(r => new Date(r.timestamp) >= startOfMonth);
    }

    if ((user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && selectedSales !== 'all') {
      return dateFiltered.filter(r => r.salesPerson.id === selectedSales);
    }
    
    return dateFiltered;
  }, [reports, filter, selectedSales, user]);

  if (!user) {
    return null; // or a loading spinner
  }

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Rekap Data Kunjungan</h1>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
                <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Semua</Button>
                <Button variant={filter === 'daily' ? 'primary' : 'secondary'} onClick={() => setFilter('daily')}>Harian</Button>
                <Button variant={filter === 'weekly' ? 'primary' : 'secondary'} onClick={() => setFilter('weekly')}>Mingguan</Button>
                <Button variant={filter === 'monthly' ? 'primary' : 'secondary'} onClick={() => setFilter('monthly')}>Bulanan</Button>
            </div>
            {isAdmin && (
                <div className="w-full md:w-64">
                    <Select id="sales-filter" label="Filter by Sales" value={selectedSales} onChange={(e) => setSelectedSales(e.target.value)}>
                        <option value="all">Semua Sales</option>
                        {salesUsers.map(sales => (
                            <option key={sales.id} value={sales.id}>{sales.name}</option>
                        ))}
                    </Select>
                </div>
            )}
        </div>
      </Card>
      
      {isLoading ? <div className="py-10"><Spinner /></div> : <ReportTable reports={filteredReports} showSalesColumn={isAdmin} />}
    </div>
  );
};

export default RekapData;