import React, { Component, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import io from 'socket.io-client';
import SourceChild from "./Source"
import Legend from "./Legend"
import stationHV from "./Station_HV_Set2.json"


mapboxgl.accessToken ='pk.eyJ1IjoicGF1aTA2MTUiLCJhIjoiY2xlZmNmNXJ1MHA1bDQ0cXFhbG84azk5biJ9.1zHF1ODeOfre40MPt1grdg';
const socket = io('http://localhost:5000');



export default function App() {


    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(121.00);
    const [lat, setLat] = useState(23.50);
    const [zoom, setZoom] = useState(6.5);
    const [jsonData,setJsonData] = useState(null)
    const [jsonDataBody,setJsonDataBody] = useState(null)    

    const [hideSource, setHideSource] = useState(false);
    const [sourceDis, setSourceDis] = useState(null)
    const [onehourRose,setOnehourRose] = useState(null)
    const [onehourHV, setOnehourHV] = useState(null)
    const [popup, setPopup] = useState(null);



    useEffect(() => {
      if (map.current) return;
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [121.0, 23.5],
        maxBounds: [[116.0, 19.5] ,[126.0, 27.5]],
        zoom:6.5,
        maxZoom: 11,
      });
    }, [])

    useEffect(() =>{
      socket.on('json', (data) => {
          console.log(data)
            const Jsondata1 = data.data1
            const Jsondata2 = data.data2
            console.log(Jsondata1)
            setJsonDataBody(Jsondata2)
            setJsonData(Jsondata1)

          if (map.current.isStyleLoaded() && map.current.getSource('rose') && map.current.getSource('rosebody')) {
              map.current.getSource('rose').setData(Jsondata1);
              map.current.getSource('rosebody').setData(Jsondata2);
          }

        })

      setTimeout(() =>{
        socket.emit("random_data");
        },5000)

      },[]);


  useEffect(() => {

    map.current.on('load', () => {

      const existingSourceBody = map.current.getSource('rosebody');
      if (!existingSourceBody) {
            map.current.addSource('rosebody', {
                'type': 'geojson',
                'data': jsonDataBody
              });
            map.current.addLayer({
            'id': 'rosebody-line',
            'type': 'line',
            'source': 'rosebody',
            'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
            'paint': {
            'line-color': 'blue',
            'line-width': 3
            }
          });
        }


      const existingSourceDis = map.current.getSource('rose');
      if (!existingSourceDis) {
          map.current.addSource('rose', {
              'type': 'geojson',
              'data': jsonData
            });
          map.current.addLayer({
          'id': 'rose-line',
          'type': 'line',
          'source': 'rose',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': 'red',
          'line-width': 3
          }
        });
      }
          
      const existingOnehourRose = map.current.getSource('onehourRose');
      if (!existingOnehourRose) {
            map.current.addSource('onehourRose', {
              'type': 'geojson',
              'data': onehourRose
            });
            map.current.addLayer({
            'id': 'onehourrose-line',
            'type': 'line',
            'source': 'onehourRose',
            'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
            'paint': {
            'line-color': 'red',
            'line-width': 3
          }
        });
      }
  


      const existingStation = map.current.getSource('station');
      if (!existingStation) {
          map.current.addSource('station',{
            'type': 'geojson',
            'data': stationHV
            
          });
          map.current.addLayer({
            'id':'station-points',
            'type':'circle',
            'source':'station',
            'paint':{
              'circle-radius':{
                'base': 5,
                'stops': [
                [7, 5],
                [11, 15]
              ]
              },
              'circle-color': 'black',
              'circle-pitch-scale':'map',
            },
            'layout':{'visibility': 'visible',},
            })
        
          map.current.addLayer({
            'id':'station-labels',
            'type':'symbol',
            'source':'station',

            'layout':{
              'visibility': 'visible',
              'text-field': ['get', 'Name'],
              'text-font': [
              'Open Sans Semibold',
              'Arial Unicode MS Bold',
            ],
              'text-offset':[2.0,1.25],
              'text-variable-anchor': ['top'],
              'text-justify': 'auto',
              'text-size':12.0,

            },
            'paint': {
              "text-color": "white"
            }
            });
          }
        })
       }, [])
      

    useEffect(() => {
      if (sourceDis) {

        if (map.current.getLayer('energy-distribution')) {
          map.current.removeLayer('energy-distribution');
        }
        if (map.current.getSource('distribution')) {
          map.current.removeSource('distribution');
        }
        if (map.current.getLayer('onehourrose-line')) {
          map.current.removeLayer('onehourrose-line');
        }
        if (map.current.getSource('onehourRose')) {
          map.current.removeSource('onehourRose');
        }
        if (map.current.getLayer('onehrstation-points')) {
          map.current.removeLayer('onehrstation-points');
        }
        if (map.current.getSource('onehrstation')) {
          map.current.removeSource('onehrstation');
        }

      const existingSource = map.current.getSource('distribution');
      if (!existingSource) {
         map.current.addSource('distribution',{
           'type':'geojson',
           'data': sourceDis
         });
         map.current.addLayer({
           'id': 'energy-distribution',
           'type':'heatmap',
           'source':'distribution',
           'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
              'heatmap-weight' :[
                'interpolate',
                ['linear'],
                ['get', 'density'],
                0,
                0,
                1,
                1
              ],

              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                1,
                11,
                3
              ],
              // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
              // Begin color ramp at 0-stop with a 0-transparancy color
              // to create a blur-like effect.
              'heatmap-color': [
                'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(0,0,255,0)',
                  0.2,
                  'rgb(100,100,255)',
                  0.4,
                  'rgb(200,200,255)',
                  0.6,
                  'rgb(255,200,100)',
                  0.8,
                  'rgb(255,100,100)',
                  1,
                  'rgb(255,0,0)'
                ],
              //Adjust the heatmap radius by zoom level
              'heatmap-radius': [
                'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  30,
                  11,
                  200
                ],
              //Transition from heatmap to circle layer by zoom level
              'heatmap-opacity': [
                'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  0.5,
                  11,
                  0.7
              ]
            
          }
          
        })}

        const existingOnehourRose = map.current.getSource('onehourRose');
        if (!existingOnehourRose) {
          map.current.addSource('onehourRose', {
            'type': 'geojson',
            'data': onehourRose
          });
          map.current.addLayer({
          'id': 'onehourrose-line',
          'type': 'line',
          'source': 'onehourRose',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible',
          },
          'paint': {
          'line-color': 'red',
          'line-width': 3
        }
        });
        }


          const existingOnehourHV = map.current.getSource('onehrstation');
          if (!existingOnehourHV) {
            map.current.addSource('onehrstation',{
              'type': 'geojson',
              'data': onehourHV
            
          });
          map.current.addLayer({
            'id':'onehrstation-points',
            'type':'circle',
            'source':'onehrstation',
            'paint':{
              'circle-radius':5,
              'circle-color': [
                'interpolate',
                  ['linear'],
                  ['get','HV'],
                  0.0,
                  'rgb(255,255,255)',
                  0.4,
                  'rgb(255,150,255)',
                  0.8,
                  'rgb(255,50,255)',
                  1.2,
                  'rgb(200,0,200)',
                  1.6,
                  'rgb(100,0,100)',
                  2.0,
                  'rgb(50,0,50)'
                ],
              'circle-pitch-scale':'map',
            },
            'layout':{'visibility': 'visible'},
            })
          }
      }
    }, [sourceDis]);
    

    useEffect(() => {
      if (sourceDis) {


    if (hideSource) {
      map.current.setLayoutProperty('energy-distribution', 'visibility', 'none');
      map.current.setLayoutProperty('onehourrose-line', 'visibility', 'none');
      map.current.setLayoutProperty('onehrstation-points', 'visibility', 'none');
      map.current.setLayoutProperty('rosebody-line', 'visibility', 'visible');
      map.current.setLayoutProperty('rose-line', 'visibility', 'visible');
    } else {
      map.current.setLayoutProperty('energy-distribution', 'visibility', 'visible');
      map.current.setLayoutProperty('onehourrose-line', 'visibility', 'visible');
      map.current.setLayoutProperty('onehrstation-points', 'visibility', 'visible');
      map.current.setLayoutProperty('rosebody-line', 'visibility', 'none');
      map.current.setLayoutProperty('rose-line', 'visibility', 'none');
    }
  }
  },[hideSource])


  useEffect(() => {

      map.current.on('mouseenter', 'station-points', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
       
      // Change it back to a pointer when it leaves.
      map.current.on('mouseleave', 'station-points', () => {
        map.current.getCanvas().style.cursor = '';
      });

      map.current.on('click', 'station-points', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const stationName = e.features[0].properties.Name
        const network = e.features[0].properties.network
        const long = coordinates[0].toFixed(2)
        const lati = coordinates[1].toFixed(2)
        const coordinates2 = e.features[0].geometry.coordinates.slice();
        if (coordinates2[1]<22.48) {
          coordinates2[1]=coordinates2[1]+1.0
        }
        const figname="./HV_spec_plot/"+stationName+"_HV_spec.png"
        setPopup(
          new mapboxgl.Popup({className: 'popup', closeButton: true, closeOnClick: true })
            .setLngLat(coordinates2)
            .setHTML(`<p style="font-size: 14px;">Network: ${network} &nbsp&nbsp&nbsp Lontitude: ${long}&nbsp&nbsp&nbsp Latitude: ${lati}</p>
            <img src=${figname} width="380px">`)
            .addTo(map.current)
        );
      })

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
        });


  },[])

  useEffect(() => {
    return () => {
      if (popup) popup.remove();
    };
  }, [popup]);

  const handleDataChange = (input1) => {    
      setSourceDis(input1);

  };

  const handleDataVisi= (input1) => {
      setHideSource(input1)
      console.log(hideSource)
  };

  const handleRoseChange = (input) => {
      setOnehourRose(input);
      map.current.setLayoutProperty('rosebody-line', 'visibility', 'none')
      map.current.setLayoutProperty('rose-line', 'visibility', 'none')
  }

  const handleHVChange = (input) => {
      setOnehourHV(input);

  }

 
      return (
        <>
        <div>
        <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div>
          <Legend />
        </div>

        <div>
          <SourceChild onDataUpdate={handleDataChange} onDataVisi={handleDataVisi} 
          onRoseUpdate={handleRoseChange} onHVUpdate={handleHVChange}/>
        </div>

          <div ref={mapContainer} style={{ width: '100%', height: '100vh'}}/>
          
        </div>
        </>
      );
    }  