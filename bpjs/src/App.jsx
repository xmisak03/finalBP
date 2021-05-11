import React, { useEffect } from "react";

import "./App.css";
import MainForm from "./MainForm"
import MainFormPCoA from "./MainFormPCoA"
import MyPlot from "./MyPlot"
import ColPlot from "./ColPlot"

import { Button } from "rsuite";

import { combineReducers, createStore } from "redux";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { header } from "./FileHandle.jsx";

import {store} from './index.js'

// set up a store and work with it
const baseInitialState = {
  x: [],          // arrays of x coordinates for each data category
  y: [],          // arrays of y coordinates for each data category
  z: [],          // arrays of z coordinates for each data category
  category: [],   // specific categories according to which data are colored
  evr: [],        // explained variability ratio for axes
  colGraph: [],   // data for the percentage of variance graph
  legend: [],     // order of name of metadata in categories
  id: [],         // ID of session
  maxPCx: [],     // the number of columns in the percentage of variance graph
  indexes: [],    // arrays of names or indexes of samples contained in each category
  showLegend: [], // is legend visible?
};

const baseReducer = (state= baseInitialState, action) => {
  switch (action.type) {
    case "storeData":
      return {
        x: JSON.parse(action.value.x),
        y: JSON.parse(action.value.y),
        z: JSON.parse(action.value.z),
        category: JSON.parse(action.value.category),
        evr: JSON.parse(action.value.evr),
        colGraph: JSON.parse(action.value.colGraph),
        legend: JSON.parse(action.value.legend),
        id: action.value.id,
        maxPCx: action.value.maxPCx,
        indexes: JSON.parse(action.value.indexes),
        showLegend: true,
      };

    default:
      return state;
  }
};

export const reducers = combineReducers({
  base: baseReducer
});


const initialState = {
  base: baseInitialState
};

export function configureStore(state = initialState) {
  const store = createStore(reducers, state);
  return store;
}

const selectDataX = createSelector(
  (state) => state.base,
  (state) => state.x,
);

const selectDataY = createSelector(
  (state) => state.base,
  (state) => state.y,
);

const selectDataZ = createSelector(
  (state) => state.base,
  (state) => state.z,
);

const selectDataCategory = createSelector(
  (state) => state.base,
  (state) => state.category,
);

const selectDataEvr = createSelector(
  (state) => state.base,
  (state) => state.evr,
);

const selectDataColGraph = createSelector(
  (state) => state.base,
  (state) => state.colGraph,
);

const selectDataLegend = createSelector(
  (state) => state.base,
  (state) => state.legend,
);

const selectDataId = createSelector(
  (state) => state.base,
  (state) => state.id,
);

const selectDataMaxPCx = createSelector(
  (state) => state.base,
  (state) => state.maxPCx,
);

const selectDataIndexes = createSelector(
  (state) => state.base,
  (state) => state.indexes,
);

const selectDataShowLegend = createSelector(
  (state) => state.base,
  (state) => state.showLegend,
);

export default function App() {
  const x = useSelector(selectDataX);
  const y = useSelector(selectDataY);
  const z = useSelector(selectDataZ);
  const category = useSelector(selectDataCategory);
  const evr = useSelector(selectDataEvr);
  const colGraph = useSelector(selectDataColGraph);
  const legend = useSelector(selectDataLegend);
  const id = useSelector(selectDataId);
  const maxPCx = useSelector(selectDataMaxPCx);
  const indexes = useSelector(selectDataIndexes);
  const showLegend = useSelector(selectDataShowLegend);
  var key

useEffect(() => {
    if (window.location.href != "http://localhost:3000/"){
        fetch(`http://localhost:3000/mailResponse/${window.location.pathname.slice(1)}`, {
            method: "POST",      
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(null),
        }).then((response) => 
            // get response from Python
            response.json()).then((data) => {
                if (data['result'] == "error"){
                    alert("SOMETHING WENT WRONG, TRY IT LATER")
                }
                else if(data != null){
                    store.dispatch({ type: "storeData", value: data });
                }
            }); 
        document.getElementById('bPCA').style.display='none'
        document.getElementById('PCA').style.display='none'
        document.getElementById('bPCoA').style.display='none'
        document.getElementById('PCoA').style.display='block'
        document.getElementById('newCalculation').style.display='block'
        document.getElementById('downloadPCoA').style.display='block'
        document.getElementById('PCoAForm').style.display='none'
        
    }
}, []);

  // reset all data in forms
  function resetAll(){
    document.getElementById('numberOfPC2').value= null
    document.getElementById('downloadPCoA').style.display='none'
    document.forms[0].reset()
    document.getElementById('filePCoA').value= null
    document.getElementById('metaFile').value= null
    document.getElementById('metadataPart').style.display='none'

    document.getElementById('numberOfPC').value= null
    document.getElementById('downloadPCA').style.display='none'
    document.forms[1].reset()
    document.getElementById('file').value= null
    document.getElementById('metaFilePCoA').value= null
    document.getElementById('metadataPartPCoA').style.display='none'
  }

  // to show pcx graph
  function pcxGraph () {
    document.getElementById('colPlot').style.display='block'
    document.getElementById('dataPlot').style.display='none'
    document.getElementById('result').style.background='rgb(229, 231, 233)'
    document.getElementById('pcx').style.background='rgb(115, 163, 252)'
    document.getElementById('legend').style.display='none'
  }

  // to show result graph
  function resultGraph () {
    document.getElementById('dataPlot').style.display='block'
    document.getElementById('colPlot').style.display='none'
    document.getElementById('pcx').style.background='rgb(229, 231, 233)'
    document.getElementById('result').style.background='rgb(115, 163, 252)'
    document.getElementById('legend').style.display='block'
  }

  function newCalculation () {
    window.location.href = "http://localhost:3000/"
  }

  // to show legend
  function showLegendButton () {
    document.getElementById('hideLegend').style.display = 'block'
    document.getElementById('showLegend').style.display='none'
    store.getState().base.showLegend = true
  }

  // to hide legend
  function hideLegendButton () {
    document.getElementById('showLegend').style.display = 'block'
    document.getElementById('hideLegend').style.display='none'
    store.getState().base.showLegend = false
  }

  // function after click pca button (disable pcoa part)
  function pcaForm() {
    for (key in header) {
      delete header[key];
    }
    
    resetAll()

    document.getElementById('PCA').style.display='block'
    document.getElementById('PCoA').style.display='none'
    document.getElementById('bPCoA').style.background='rgb(229, 231, 233)'
    document.getElementById('bPCA').style.background='rgb(115, 163, 252)'
  }

  // function after click pcoa button (disable pca part)
  function pcoaForm() {
    
    for (key in header) {
      delete header[key];
    }
    
    resetAll()

    document.getElementById('PCoA').style.display='block'
    document.getElementById('PCA').style.display='none'
    document.getElementById('bPCA').style.background='rgb(229, 231, 233)';
    document.getElementById('bPCoA').style.background='rgb(115, 163, 252)';
  }
  
  // layout
  return (
    <section>  
      <div>
        <Button id="newCalculation" className="newCalculation" size="lg" onClick={newCalculation}>
          <strong>NEW CALCULATION</strong>
        </Button> 
        <Button id="bPCA" className="buttonpca" size="lg" onClick={pcaForm}><strong>PCA</strong></Button>    
        <Button id="bPCoA" className="buttonpcoa" size="lg" onClick={pcoaForm}><strong>PCoA</strong></Button>
      </div>

      <div id="PCA" name="PCA" className="formpca">
        <MainForm /> 
      </div>
      <div id="PCoA" className="formpcoa">
        <MainFormPCoA />     
      </div>

      <div className="plotButtons">
          <Button id="pcx" className="pcx" size="lg" onClick={pcxGraph}><strong>Percentage of Variance</strong></Button>    
          <Button id="result" className="result" size="lg" onClick={resultGraph}><strong>Result</strong></Button>
      </div>
      <div className="plotButtons" id="legend">
          <Button id="showLegend" className="showLegend" size="lg" onClick={showLegendButton}><strong>Show Legend</strong></Button> 
          <Button id="hideLegend" className="hideLegend" size="lg" onClick={hideLegendButton}><strong>Hide Legend</strong></Button>    
      </div>
      <div className="graph">
        <div className="dataPlot" id="dataPlot">
          <MyPlot/>
        </div>
        <div className="colPlot" id="colPlot">
          <ColPlot/>
        </div>
      </div>
    </section> 
  );
}
