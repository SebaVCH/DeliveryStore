import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type TablaPaginacionProps<T> = {
    filas: T[];
    columnas: GridColDef[];
    cantidad: string;
    altura?: number;
    onCantidadChange?: (cantidad: string) => void;
};

export default function TablaPaginacionGenerica<T>({
                                                       filas, columnas, cantidad, altura = 400, onCantidadChange
                                                   }: TablaPaginacionProps<T>) {
    const rows = filas.map((f: any) => {
        const flattenedRow: any = {
            id: f.id || f.ID || f.PublicID,
            ...f
        };

        const flattenObject = (obj: any, prefix = '') => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    flattenObject(obj[key], prefix + key + '_');
                } else {
                    flattenedRow[prefix + key] = obj[key];
                }
            }
        };

        for (const key in f) {
            if (typeof f[key] === 'object' && f[key] !== null && !Array.isArray(f[key])) {
                flattenObject(f[key], key + '_');
            }
        }

        return flattenedRow;
    });

    const pageSize = cantidad === 'all' ? (rows.length || 5) : Number(cantidad) || 5;
    const pageSizeOptions = [5, 10, 25, 50, 100];
    if (rows.length > 0) pageSizeOptions.push(rows.length);

    return (
        <Paper sx={{ height: altura, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columnas}
                pageSizeOptions={pageSizeOptions}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: pageSize }
                    }
                }}
                onPaginationModelChange={(model) => {
                    if (onCantidadChange) {
                        if (model.pageSize === rows.length) {
                            onCantidadChange('all');
                        } else {
                            onCantidadChange(String(model.pageSize));
                        }
                    }
                }}
                disableRowSelectionOnClick
                sx={{ border: 0}}
            />
        </Paper>
    );
}