import { Component } from "react";
import React from "react";
import Plot from 'react-plotly.js';
import "./App.css";

import {store} from './index.js'

// prepare data for ColPlot
function prepareData() {
    var x = []
    var y = []
    for (var i = 0; i < store.getState().base.colGraph.length; i++) {
        x.push("PC" + (i+1))
        y.push(store.getState().base.colGraph[i])
    } 
    return {x:x, y:y}
}

// plot of explained variance ratio
class ColPlot extends Component {
    render() {
        return (
            <Plot
                data={[
                {type: 'bar', marker:{color: '#73a3fc'}, x: prepareData().x, y: prepareData().y},
                ]}
                layout={
                    {width: 1050, height: 650, 
                    xaxis: { title: 'PCx' },
                    yaxis: { title: '%' }
                    }
                }
                config={{
                    scrollZoom: true, 
                    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d','resetCameraLastSave3d','hoverClosest3d','hoverClosestCartesian', 'toggleSpikelines','hoverCompareCartesian'],
                }}
            />
        );
      }
}
export default ColPlot;