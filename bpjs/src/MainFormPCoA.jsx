import React from "react";
import "./App.css";
import { Formik, Form } from "formik";
import "./App.jsx";

import { handleFileChosen } from "./FileHandle.jsx";
import { header } from "./FileHandle.jsx";
import { Component } from "react";

import {store} from './index.js'

import {saveAs} from "file-saver";

let mail

const state = {
    button: 1
};

class MainFormPCoA extends Component {
    update = () => {
        this.forceUpdate();
    };

    // waiting for data in case of unifrac calculation
    waitingForData(id){
        let timer = setInterval(function() {  
            fetch(`http://localhost:3000/result/${id}`, {
                method: "POST",      
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(null),
            }).then((response) => 
                // get response from Python
                response.json()).then((data) => {
                    if (data == null){
                        //pass
                    }
                    else if (data['result'] == "error"){
                        clearInterval(timer);
                        alert("SOMETHING WENT WRONG, CHECK YOUR INPUT DATA")
                    }
                    else if(data != null){
                        clearInterval(timer);
                        document.getElementById('downloadPCoA').style.display='block'
                        store.dispatch({ type: "storeData", value: data });
                    }
                }); 
        }, 5000);
    }

    // after select data file type
    onSelect(e, fileType, props) {
        console.log(fileType)
        if (fileType == "biom") {
            document.getElementById('metaFilePCoA').value = null
            document.getElementById('filePCoA').value= null
            document.getElementById('metadataPartPCoA').style.display='none'
            document.getElementById('coloringSectionPCoA').style.display='none'
            document.getElementById('downloadPCoA').style.display='none'
            props.metaFile = ''
            props.file = ''
        }      
        else {
            if (props.values.fileType == "biom") {
                document.getElementById('coloringSectionPCoA').style.display='none'
            }
            document.getElementById('metadataPartPCoA').style.display='block'
            document.getElementById('downloadPCoA').style.display='none'
            props.file = ''
        }
    }

    // send file without metadata to Python
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
            document.getElementById('metaFilePCoA').value = null
            document.getElementById('metadataPartPCoA').style.display='none'
            handleFileChosen(e, e.target.files[0], props)
            document.getElementById('coloringSectionPCoA').style.display='block'
            props.metaFile = ''
        }
        else{
            document.getElementById('metadataPartPCoA').style.display='block'
            document.getElementById('downloadPCoA').style.display='none'
            if (props.metaFile == '')
                document.getElementById('coloringSectionPCoA').style.display='none'
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

    getMail() {
        let inputMail = prompt("It may take a while. Please enter your mail for results:", "");
        const regexMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexMail.test(String(inputMail).toLowerCase())) {
            return inputMail
        }
        else {
            return ""
        }
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
                nod - number of dimensions for column graph
                downloadType - type of file for downloading data for column graph
                matrixType - type of file for downloading matrix
                matrix - method for matrix calculation
                 */
                initialValues={{dimension: '2D', type: 'PCoA', fileType: 'csv', file: '',coloring: '', metaFileType: 'csv', 
                metaFile: '', nod: '', downloadType: 'csv', matrixType: 'csv', matrix: 'bray_curtis', mail: ''}}
                onSubmit={values => {  
                    console.log('submitting', values);  
                }}
                
                // send parameters to Python
                onSubmit={(values) => {
                    // send data for calculation
                    if (state.button === 1) {
                        if (values.coloring.length === 0){
                            alert("CHOOSE DATAFILE, METADATAFILE AND METADATA FOR COLORING")
                        }
                        else{
                            if (values.matrix != "bray_curtis"){
                                while (values.mail == "") {
                                    mail = this.getMail()
                                    if (mail != "") {
                                        values.mail = mail
                                    }
                                }
                                values.mail = prompt("It may take a while. Please enter your mail for results:", "");
                            }
                            else {
                                alert("THE DATA IS BEING PROCESSED...")
                            }
                            
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
                                    else if(Object.keys(data).length == 1){
                                        this.waitingForData(data.id)
                                    }
                                    else{
                                        document.getElementById('nod').value= null
                                        document.getElementById('downloadPCoA').style.display='block'
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
                            alert("ENTER A NUMBER OF DIMENSIONS")
                        }
                        else if (values.nod < 1 || values.nod > store.getState().base.colGraph.length){
                            alert("NUMBER OF DIMENSIONS OUT OF RANGE")
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
                                    saveAs(blob, "table.data");
                                else if (values.downloadType === 'json')
                                    saveAs(blob, "table.json");
                                else if (values.downloadType === 'excel')
                                    saveAs(blob, "table.xlsx");
                            })
                            .catch(error => {
                                alert("SAVING UNSUCCESSFUL")
                            })
                        }
                    }

                    // send data for saving matrix file
                    if (state.button === 3) {
                        alert("THE MATRIX IS BEING PREPARED...")
                        fetch("http://localhost:3000/matrix", {
                            method: "POST",      
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({id: store.getState().base.id, downloadType: values.matrixType}),
                        }).then(function (response) {
                            return response.blob();
                            }
                        )
                        .then(function(blob) {
                            if (values.matrixType === 'csv')
                                saveAs(blob, "matrix.data");
                            else if (values.matrixType === 'json')
                                saveAs(blob, "matrix.json");
                            else if (values.matrixType === 'excel')
                                saveAs(blob, "matrix.xlsx");
                        })
                        .catch(error => {
                            alert("SAVING UNSUCCESSFUL")
                        })
                    }
                }}
            >
            {(props) => (
                <Form onSubmit={props.handleSubmit}>
                    <div id="PCoAForm">
                        <label className="title">
                            Dimension
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

                        <label className="title">
                            Method for matrix calculation
                        </label>
                        <div>
                            <select
                                className="select"
                                name="matrix"
                                id="matrix"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.matrix}
                            >
                                <option value="bray_curtis">Bray-Curtis</option>
                                <option value="unifrac_weighted">Unifrac weighted</option>
                                <option value="unifrac_unweighted">Unifrac unweighted</option>
                            </select>
                        </div>

                        <div>
                            <label className="warning">
                                FILE HAS TO CONTAIN HEADER AND BE IN PROPER FORMAT!
                            </label>
                        </div>

                        <label className="title">
                            Data for matrix calculation
                        </label>

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
                                <option value="csv">csv/txt</option>
                                <option value="json">json</option>
                                <option value="excel">excel</option>
                                <option value="biom">biom</option>
                            </select>
                        </div>

                        <div>                
                            <input
                                type="file"
                                name="file"
                                id="filePCoA"
                                onChange={this.update}
                                onInput={e => {this.onChange(e, props.values)}}
                                onBlur={props.handleBlur}
                            />
                        </div>

                        <div className="metadataPart" id="metadataPartPCoA">
                            <label className="title">
                                Metadata file
                            </label>
                            <div>
                                <label className="noteColoring">
                                    In the case of biom format also with metadata, otherwise without it.
                                </label> 
                            </div>

                            <div>
                                <select
                                    className="select"
                                    name="metaFileType"
                                    id="metaFileTypePCoA"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.metaFileType}
                                >
                                    <option value="csv">csv/txt</option>
                                    <option value="json">json</option>
                                    <option value="excel">excel</option>
                                </select>
                            </div>
                            <div>                
                                <input
                                    type="file"
                                    name="metaFile"
                                    id="metaFilePCoA"
                                    onChange={this.update}
                                    onInput={e => {this.onChangeM(e, props.values)}}
                                    onChangeCapture={e => {handleFileChosen(e, e.target.files[0], props.values)}} 
                                    onBlur={props.handleBlur}
                                />
                            </div>
                        </div>                    
                        
                        <label className="noteColoring">
                            Below, select metadata for coloring, please.
                        </label>

                        <div id="coloringSectionPCoA">
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
                        
                    </div>

                    <div id="downloadPCoA" className="noteDownload" style={{paddingTop: '10px'}}>
                        <label className="title">
                            Download options
                        </label>

                        <div>
                            <label>
                                Select a file type for downloading distance matrix according to a calculation in previous step.
                            </label>
                        </div>
                        
                        <div>
                            <select
                                className="select"
                                name="matrixType"
                                id="matrixType"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.matrixType}
                            >
                                <option value="csv">csv</option>
                                <option value="json">json</option>
                                <option value="excel">excel</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" classtype="submit" style={{width: '100%'}} onClick={() => (state.button = 3)}>
                                Download distance matrix
                            </button>
                        </div>

                        <label>
                            If you want to download table of transformation data according to a calculation in previous step, 
                            enter a number of dimensions from range (1, {store.getState().base.maxPCx}), please.
                        </label>

                        <input type="text" id="nod" className="input" onChange={props.handleChange}/>

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
                                <option value="excel">excel</option>
                            </select>
                        </div>
                        
                        <div>
                            <button type="submit" classtype="submit" style={{width: '100%'}} onClick={() => (state.button = 2)}>
                                Download transformed data
                            </button>
                        </div>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
        );
    }
  };
  export default MainFormPCoA;
