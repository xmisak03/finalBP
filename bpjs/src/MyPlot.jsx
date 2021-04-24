import { Component } from "react";
import React from "react";
import Plot from "react-plotly.js";
import "./App.css";

import {store} from './index.js'

// prepare data for MyPlot
function prepareData() {
    var data = {
        data: []
    }
    var type = '';
    if (store.getState().base.z.length === 0){
        type = 'scatter'
    }
    else{
        type ='scatter3d'
    }
    for (var i = 0; i < store.getState().base.x.length; i++) {
        var g = {
            "x": store.getState().base.x[i], 
            "y": store.getState().base.y[i], 
            "z": store.getState().base.z[i], 
            "text": store.getState().base.indexes[i], 
            "type": type, 
            "name": store.getState().base.category[i], 
            mode: 'markers', 
            marker: {size: '4'},
            showlegend: store.getState().base.showLegend,
        }
        data.data.push(g)
    } 
    return data
}

// plot of results of PCA or PCoA
class MyPlot extends Component {
    render() {
        return (
            <section>
                <Plot id="graph" className="graph" 
                    data={prepareData().data}
                    layout={{
                        uirevision: true, 
                        autosize: false,  
                        legend: {
                            orientation: 'h', 
                            y: 0.75,
                            x: 0.2,
                            xanchor: "left",
                            title: {
                                text: store.getState().base.legend,
                                side: "top",
                                font: {
                                    color: 'blue',
                                }
                            },
                        },
                        margin: {
                            l:80,
                            t: 25,
                            b: 45,
                            pad: 10,
                        },
                        width: 1150, 
                        height: 630,
                        scene:{
                            aspectratio: {
                                x: 1, y: 1, z: 1,
                                uirevision: true,
                            },
                            xaxis:{title: 'PC1 (' + (store.getState().base.evr[0]*100).toFixed(5) + '%)'},
                            yaxis:{title: 'PC2 (' + (store.getState().base.evr[1]*100).toFixed(5) + '%)'},
                            zaxis:{title: 'PC3 (' + (store.getState().base.evr[2]*100).toFixed(5) + '%)'},
                        },
                        xaxis: { title: 'PC1 (' + (store.getState().base.evr[0]*100).toFixed(5) + '%)'},
                        yaxis: { title: 'PC2 (' + (store.getState().base.evr[1]*100).toFixed(5) + '%)'},
                    }}
                    config={{
                        scrollZoom: true, 
                        modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d','resetCameraLastSave3d','hoverClosest3d','hoverClosestCartesian', 'toggleSpikelines','hoverCompareCartesian'],
                    }}
                />
            </section>
        )
    }
}
export default MyPlot;