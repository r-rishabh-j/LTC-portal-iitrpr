import React from "react";
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid"

function DataGridToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport printOptions={{ disableToolbarButton: true }} csvOptions={{
                fileName: 'export',
            }} />
        </GridToolbarContainer>
    );
}

export default DataGridToolbar
