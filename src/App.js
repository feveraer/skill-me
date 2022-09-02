import './App.css';
import {RadarChart} from "skills-radar-chart";
import {Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Add, Cancel, Delete, Edit, Save, Whatshot} from "@mui/icons-material";
import {DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer} from "@mui/x-data-grid";
import {randomId,} from '@mui/x-data-grid-generator';
import {Box, Button} from "@mui/material";


function EditToolbar(props) {
    const {setRows, setRowModesModel} = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldSkills) => [...oldSkills, {id, name: '', percentage: 0, isNew: true}]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit},
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<Add/>} onClick={handleClick}>
                Add skill
            </Button>
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};


function App() {
    const [rows, setRows] = useState([]);

    const [rowModesModel, setRowModesModel] = useState({});

    useEffect(() => {
        let storedSkills = localStorage.getItem("skills");
        if (storedSkills !== null) {
            setRows(JSON.parse(storedSkills));
        }
    }, []);

    const saveSkillsToLocalStorage = (rows) => {
        localStorage.setItem("skills", JSON.stringify(rows));
    }

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id) => () => {
        let updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
        saveSkillsToLocalStorage(updatedRows);
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false};
        let updatedRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
        setRows(updatedRows);
        saveSkillsToLocalStorage(updatedRows);
        return updatedRow;
    };


    const columns = [
        {field: 'id', headerName: 'ID', width: 200, hide: true},
        {
            field: 'name',
            headerName: 'Name',
            width: 400,
            editable: true,
        },
        {
            field: 'percentage',
            headerName: 'Percentage',
            type: 'number',
            width: 100,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<Save/>}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<Cancel/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<Edit/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<Delete/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Container fluid className="App">
            <Row className="mt-2">
                <h1>
                    <Whatshot/>&nbsp;Skill me&nbsp;<Whatshot/>
                </h1>
            </Row>
            <Row className="mt-2">
                <Col className="col-12 col-md-6">
                    <Box sx={{
                        height: 400, width: '100%', '& .actions': {
                            color: 'text.secondary',
                        },
                        '& .textPrimary': {
                            color: 'text.primary',
                        },
                    }}>
                        <DataGrid columns={columns} rows={rows}
                                  editMode="row"
                                  rowModesModel={rowModesModel}
                                  onRowEditStart={handleRowEditStart}
                                  onRowEditStop={handleRowEditStop}
                                  processRowUpdate={processRowUpdate}
                                  components={{
                                      Toolbar: EditToolbar,
                                  }}
                                  componentsProps={{
                                      toolbar: {setRows, setRowModesModel},
                                  }}
                                  experimentalFeatures={{newEditingApi: true}}/>
                    </Box>
                </Col>
                <Col className="col-12 col-md-6">
                    <RadarChart
                        rawData={rows}
                        skillPercentage="percentage"
                        skillName="name"
                        label="Skills"
                        backgroundColor="rgba(255, 99, 132, 0.2)"
                        borderColor={["blue", "red", "green", "yellow"]}
                        borderWidth="2"
                        pointBackgroundColor="rgb(54, 162, 235)"
                        pointBorderColor={["blue", "red", "green", "yellow"]}
                        pointHoverBackgroundColor="#fff"
                        pointHoverBorderColor="rgb(54, 162, 235)"
                        borderDash={[2, 5]}
                        borderDashOffset="8"
                        angleLines="rgba(255, 99, 132, 0.2)"
                        grid="rgba(255, 99, 132, 0.2)"
                        pointLabels="rgba(255, 99, 132, 0.2)"
                        ticks="rgba(255, 99, 132, 0.2)"
                        ShowLegend={false}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default App;
