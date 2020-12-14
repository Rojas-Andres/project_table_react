import React, {useState} from 'react'
import { COLUMNS } from './columns'
import { useTable ,useSortBy, useFilters, useGlobalFilter, useAsyncDebounce ,usePagination  } from 'react-table'
//import MOCK_DATA from './MOCK_DATA.json' => datos de prueba
import { CheckBox } from './CheckBox'
import './bootstrap.min.css'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';  
import {Dropdown,DropdownMenu,DropdownToggle} from 'reactstrap'

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span>
            Buscar:{' '}
            <input 
                className="form-control"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Filtrar`}
            />
        </span>
    )
}

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length

    return (
        <input
            className="form-control"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}


export const PaginationTable = (props) => {
    console.log("props es ",props.items)
    
    //console.log("A es: tal cosa",MOCK_DATA)

    console.log("LAS COLUMNAS SON",COLUMNS)
   
    const [dropdown,setDropdown]=useState(false);
    
    const abrirCerrarDropdown=()=>{
        setDropdown(!dropdown)
    }

    const columns = COLUMNS
    const data = props.items
    const alerta=(props)=>{
        console.log(props)      
        return(
            alert(props)
        )
    }
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        //rows ,//Esta es para sin paginacion
        page,
        nextPage,
        previousPage, // Navegar en las paginas
        canNextPage, // Me indican si es posible avanzar
        canPreviousPage,
        prepareRow,
        pageOptions,
        setPageSize,//Ajusta el tamaño
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        allColumns,
        getToggleHideAllColumnsProps       
    } = useTable({
        columns,
        data
    },
    useFilters,
    useGlobalFilter
    ,useSortBy,
    usePagination)
    const { pageIndex , pageSize } = state

    console.log(columns)
    
    return (
        <>
        <div class="container">
        <div  class="p-3 mb-2 bg-secondary text-primary">
            <h1 >Biblioteca</h1>
        </div>
        </div>
        <div class="container">
            <div class="row">
                    
                    <div class="col-12 col-md-4">
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </div>

                    <div class="col-6 col-md-4 text-primary ">
                        {/*Exportar el excel https://github.com/zsusac/ReactHTMLTableToExcel */}
                        <ReactHTMLTableToExcel  

                            className="btn btn-info"  

                            table="book"  

                            filename="Reporte_Excel"  

                            sheet="Sheet"  

                            buttonText="Exportar" />  
                    </div>

                    {/* https://www.youtube.com/watch?v=aLEgeiKuILk&t=315s -> menu desplegable */ }
                    <div class="col-12 col-md-4">
                    <Dropdown isOpen={dropdown} toggle={abrirCerrarDropdown}>
                        <DropdownToggle caret>
                            Columnas
                        </DropdownToggle>
                        <DropdownMenu>
                        <div>
                            <CheckBox {...getToggleHideAllColumnsProps()}/>Seleccionar todo
                        </div>
                        {
                            allColumns.map(column=>(
                                <div key={column.id}>
                                    <label>
                                        <input type="checkbox" {...column.getToggleHiddenProps()}/>
                                        {column.Header}
                                        
                                    </label>
                                </div>
                            ))
                        }
                        </DropdownMenu>
                    </Dropdown>
                    
                </div>
                </div>
        </div>
        <div class="container">
            
           
            {/*https://www.youtube.com/watch?v=YwP4NAZGskg&list=PLC3y8-rFHvwgWTSrDiwmUsl4ZvipOw9Cz -> 
                Toda la parte de la tabla*/}
            <table id="book" class="table table-hover" {...getTableProps()}>
                
                <thead class="thead-dark">
                    {/* Header de la tabla*/}
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th scope="row" {...column.getHeaderProps(column.getSortByToggleProps())}> {column.render('Header')}
                                
                                
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? '▲':'▼'):''}
                                </span>
                                
                                </th>
                            ))}
                            
                        </tr>
                    ))}


                </thead>
                {/* Traemos todos los registros uno a uno*/}
                <tbody {...getTableBodyProps()}>
                
                    {page.map((row) => {
                        prepareRow(row)
                        return (
                            //https://github.com/tannerlinsley/react-table/discussions/2295 -> para el onClick
                            
                            <tr {...row.getRowProps()} onClick={() => {alerta(row.original.title)}}> 
                                {row.cells.map((cell) => {
                                    
                                    return <td {...cell.getCellProps()} >{cell.render('Cell')} </td>
                                })}
                                
                            </tr>
                            
                        )
                    })}
                 
                </tbody>
            </table>
            <div>
            {/* Esta parte es para definir la cantidad de valores que puede tomar al momento de mostrar */}
                <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
                    {
                        [5,10,20,50,100].map(pageSize=>(
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))
                    }
                </select>
                {/* Esta parte definine el anterior y el siguiente de la tabla, el contador*/}
                <span >
                    Pagina{' '}
                    <strong >
                        {pageIndex + 1 } de {pageOptions.length}
                    </strong>{' '}
                </span>
                {/* Esta parte definine el anterior y el siguiente de la tabla, los bonotes de siguiente*/}
                <div class="btn-group">
                    <button type="button" class="btn btn-dark " onClick={()=>previousPage()} disabled={!canPreviousPage}> Anterior</button>
                    <button type="button"  class="btn btn-dark"  onClick={()=>nextPage()} disabled={!canNextPage}>Siguiente</button>
                
                </div>
            </div>
              
        </div>
        </>
    )
}
