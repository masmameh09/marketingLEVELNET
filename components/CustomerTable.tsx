import React, { useState } from 'react';
import type { Customer } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

// A simple chevron icon for the accordion
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const DetailItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white break-words">{value || '-'}</dd>
    </div>
);

const CustomerCardView: React.FC<{ customer: Customer, showSalesColumn: boolean }> = ({ customer, showSalesColumn }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const detailsToCopy = [
            `Detail Pelanggan:`,
            `--------------------------`,
            `Nama Pelanggan: ${customer.customerName}`,
            `Nama Usaha: ${customer.businessName || '-'}`,
            `Nomor HP: ${customer.phoneNumber}`,
            `Alamat: ${customer.address}`,
            `Tanggal Daftar: ${new Date(customer.registrationDate).toLocaleDateString('id-ID')}`,
            `Didaftarkan Oleh: ${customer.registeredBy?.name || 'N/A'}`,
            `Keterangan: ${customer.notes || '-'}`,
            `--------------------------`
        ].join('\n');

        navigator.clipboard.writeText(detailsToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };

    return (
        <Card className="transition-all duration-300 shadow-sm hover:shadow-md">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center text-left p-2 -m-2"
                aria-expanded={isExpanded}
                aria-controls={`customer-details-${customer.id}`}
            >
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{customer.customerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.businessName || 'Kontak Personal'}</p>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
                <div id={`customer-details-${customer.id}`} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <DetailItem label="Tanggal Daftar" value={new Date(customer.registrationDate).toLocaleDateString('id-ID')} />
                        <DetailItem label="Nomor HP" value={customer.phoneNumber} />
                        <div className="sm:col-span-2">
                            <DetailItem label="Alamat Lengkap" value={customer.address} />
                        </div>
                        {showSalesColumn && <DetailItem label="Didaftarkan Oleh" value={customer.registeredBy?.name || 'N/A'} />}
                        <div className="sm:col-span-2">
                           <DetailItem label="Keterangan Tambahan" value={customer.notes} />
                        </div>
                    </dl>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleCopy} variant="secondary">
                            {isCopied ? 'Berhasil Disalin!' : 'Salin Info Pelanggan'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};


export const CustomerTable: React.FC<{ customers: Customer[]; showSalesColumn: boolean }> = ({ customers, showSalesColumn }) => {
    if (customers.length === 0) {
        return (
            <Card className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Tidak ada data pelanggan untuk ditampilkan.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {customers.map((customer) => (
                <CustomerCardView key={customer.id} customer={customer} showSalesColumn={showSalesColumn} />
            ))}
        </div>
    );
};