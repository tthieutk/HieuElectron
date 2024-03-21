// DataContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface DataContextProps {
    children: ReactNode;
}

interface DataContextValue {
    updateExcelData: (newData: string[][]) => void;
    setTableData: (newData: string[][]) => void;  // Thêm dòng này
    tableData: string[][];
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const DataProvider = ({ children }: DataContextProps) => {
    const [excelData, setExcelData] = useState<string[][]>([]);
    const [tableData, setTableData] = useState<string[][]>([]);

    const updateExcelData = (newData: string[][]) => {
        setExcelData(newData);
    };

    return (
        <DataContext.Provider value={{ updateExcelData, setTableData, tableData }}>
            {children}
        </DataContext.Provider>
    );
};

const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export { DataProvider, useData };