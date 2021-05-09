import React from "react";
import "./App.css";
import { Formik, Form } from "formik";
import "./App.jsx";

import { handleFileChosen } from "./FileHandle.jsx";
import { header } from "./FileHandle.jsx";
import { Component } from "react";

import {store} from './index.js'

import {saveAs} from "file-saver";

import ReactTooltip from 'react-tooltip';

const state = {
    button: 1
};

class MainForm extends Component {
    update = () => {
        this.forceUpdate();
    };

    // after select data file type
    onSelect(e, fileType, props) {
        if (fileType == "biom") {
            document.getElementById('metaFile').value = null
            document.getElementById('file').value= null
            document.getElementById('metadataPart').style.display='none'
            document.getElementById('coloringSection').style.display='none'
            document.getElementById('downloadPCA').style.display='none'
            props.metaFile = ''
            props.file = ''
        }      
        else {
            if (props.values.fileType == "biom") {
                document.getElementById('coloringSection').style.display='none'
            }
            document.getElementById('metadataPart').style.display='block'
            document.getElementById('downloadPCA').style.display='none'
            props.file = ''
        }
    }

    // send file to Python and set visibility of components
    onChange(e, props) {
        const formData = new FormData();
        formData.append('file', e.target.files[0])
        formData.append('filename', e.target.value)
        fetch("http://localhost:3000/file", {
            method: "POST",      
            body: formData,
        }).then((response) => {
            response.text().then(function(data) {
                props.file = data
              });
        });

        if (props.fileType === 'biom'){
            document.getElementById('metaFile').value = null
            document.getElementById('metadataPart').style.display='none'
            handleFileChosen(e, e.target.files[0], props)
            document.getElementById('coloringSection').style.display='block'
            props.metaFile = ''
        }
        else{
            document.getElementById('metadataPart').style.display='block'
            document.getElementById('downloadPCA').style.display='none'
            if (props.metaFile == '')
                document.getElementById('coloringSection').style.display='none'
        }
    }

    // send file with metadata to Python 
    onChangeM(e, props) {
        const formData = new FormData();
        formData.append('file', e.target.files[0])
        formData.append('filename', e.target.value)
        fetch("http://localhost:3000/file", {
            method: "POST",      
            body: formData,
        }).then((response) => {
            response.text().then(function(data) {
                props.metaFile = data
              });
        });
    }

    render() {
        return (
        <div className="formWrapper">
            <Formik
                /*
                dimension - 2D/3D
                type - type of analysis
                fileType - type of data file
                file - data file
                coloring - metadata for coloring
                metaFileType - type of metadata file
                metaFile - metadata file
                nod - number of principal components for column graph
                downloadType - type of file for downloading data for column graph
                matrixType - type of file for downloading matrix
                matrix - method for matrix calculation
                 */
                initialValues={{dimension: '2D', type: 'PCA', fileType: 'csv', file: '', coloring: '', metaFileType: 'csv',metaFile: '', 
                nod: '', downloadType: 'csv',  matrixType: 'csv', matrix: '', mail: ''}}
                onSubmit={values => {  
                    console.log('submitting', values);  
                }}

                // send parameters to Python
                onSubmit={(values) => {
                    // send data for calculation
                    if (state.button === 1) {
                        if (values.coloring.length === 0){
                            alert("CHOOSE DATAFILE, METADATAFILE, AND METADATA FOR COLORING")
                        }
                        else{
                            alert("THE DATA IS BEING PROCESSED...")
                            fetch("http://localhost:3000/api", {
                                method: "POST",      
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values),
                            }).then((response) => 
                                // get response from Python
                                response.json()).then((data) => {
                                    if (data === null){
                                        alert("WRONG INPUT DATA OR FILE");
                                    }
                                    else{
                                        document.getElementById('nod2').value= null
                                        document.getElementById('downloadPCA').style.display='block'
                                        document.getElementById('showLegend').style.display = 'none'
                                        document.getElementById('hideLegend').style.display='block'
                                        store.dispatch({ type: "storeData", value: data });
                                    }
                                });
                        }
                    }

                    // send data for saving PCx file
                    if (state.button === 2) {
                        if (values.nod === ""){
                            alert("ENTER A NUMBER OF PRINCIPAL COMPONENTS")
                        }
                        else if (values.nod < 1 || values.nod > store.getState().base.maxPCx){
                            alert("NUMBER OF PRINCIPAL COMPONENTS OUT OF RANGE")
                        }
                        else{
                            alert("THE TABLE IS BEING PREPARED...")
                            fetch("http://localhost:3000/table", {
                                method: "POST",      
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({id: store.getState().base.id, nod: values.nod, 
                                    downloadType: values.downloadType}),
                            }).then(function (response) {
                                return response.blob();
                                }
                            )
                            .then(function(blob) {
                                if (values.downloadType === 'csv')
                                    saveAs(blob, "table.csv");
                                else if (values.downloadType === 'json')
                                    saveAs(blob, "table.json");
                                else if (values.downloadType === 'excel')
                                    saveAs(blob, "table.xlsx");
                            })
                            .catch(error => {
                                alert("SAVING FAILD")
                            })
                        }
                    }
                }}
            >
            {(props) => (
                <Form onSubmit={props.handleSubmit}>
                    <label className="title">
                        Dimenionality
                    </label>

                    <div>
                        <select
                            className="select"
                            name="dimension"
                            id="dimension"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.dimension}
                        >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                        </select>
                    </div>

                    <ReactTooltip id="fileTipPCA" place="top" effect="solid" >
                        <p>This file should contain a header and the first column should be a column with an index.</p>
                        <p>In the case of biom-format this file should contains also metadata.</p> 
                        <p>Otherwise, there are only data for principal components calculation.</p>
                    </ReactTooltip>

                    <label className="title">
                        Data for analysis
                    </label>

                    <div>
                        <label className="noteColoring" data-tip data-for="fileTipPCA">
                            More info about file format.
                        </label>
                    </div>
                                                           
                    <div>
                        <select
                            className="select"
                            name="fileType"
                            id="fileType"
                            ref = {(input)=> this.fileType = input}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.fileType}
                            onChangeCapture={e => {this.onSelect(e, this.fileType.value, props)}}
                        >
                            <option value="csv">csv/data/tsv/txt</option>
                            <option value="json">json</option>
                            <option value="excel">xlsx/xlsm/xltx/xltm</option>
                            <option value="biom">biom</option>
                        </select>
                    </div>

                    <div>                
                        <input
                            type="file"
                            name="file"
                            id="file"
                            onChange={this.update}
                            onInput={e => {this.onChange(e, props.values)}}
                            onBlur={props.handleBlur}
                        />
                    </div>

                    <ReactTooltip id="metafileTipPCA" place="top" effect="solid" >
                        <p>This file should contain a header.</p>
                    </ReactTooltip>

                    <div className="metadataPart" id="metadataPart">
                        <label className="title">
                            Metadata file
                        </label>

                        <div>
                            <label className="noteColoring" data-tip data-for="metafileTipPCA">
                                More info about file format.
                            </label>
                        </div>

                        <div>
                            <select
                                className="select"
                                name="metaFileType"
                                id="metaFileType"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.metaFileType}
                            >
                                <option value="csv">csv/data/tsv/txt</option>
                                <option value="json">json</option>
                                <option value="excel">xlsx/xlsm/xltx/xltm</option>
                            </select>
                        </div>

                        <div>                
                            <input
                                type="file"
                                name="metaFile"
                                id="metaFile"
                                onChange={this.update}
                                onInput={e => {this.onChangeM(e, props.values)}}
                                onChangeCapture={e => {handleFileChosen(e, e.target.files[0], props.values)}} 
                                onBlur={props.handleBlur}
                            />
                        </div>
                    </div>

                    <label className="noteColoring">
                        Below, after the selection of the metadata file, select metadata for coloring, please.
                    </label>
                    
                    <div id="coloringSection">
                        {header.map(element => (
                            <div key={element} className="metadata">
                                <input 
                                    type="checkbox"
                                    name="coloring"
                                    id="coloring"
                                    value={element}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                                <p>{element}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <button type="submit" classtype="submit" onClick={() => (state.button = 1)}>
                            Submit
                        </button> 
                    </div>
                    

                    <div id="downloadPCA" className="noteDownload" style={{paddingTop: '10px'}}>
                        <label className="title">
                            Download options
                        </label>
                        <div>
                            <label>
                                If you want to download table of transformation data according to a calculation in previous step, 
                                enter a number of first X principal components from range (1, {store.getState().base.maxPCx}), please.
                            </label>
                        </div>
                        

                        <input type="text" name="nod" className="input" id="nod2" onChange={props.handleChange}/>

                        <div>
                            <select
                                className="select"
                                name="downloadType"
                                id="downloadType"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.downloadType}
                            >
                                <option value="csv">csv</option>
                                <option value="json">json</option>
                                <option value="excel">xlsx</option>
                            </select>
                        </div>

                        <button type="submit" classtype="submit" style={{width: '100%'}} onClick={() => (state.button = 2)}>
                            Download transformed data
                        </button>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
        );
    }
  };
  export default MainForm;
