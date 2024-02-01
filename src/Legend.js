import mapboxgl from 'mapbox-gl';
import React, { Component, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { FaInfo } from "react-icons/fa";


export default function Legend() {
    const [showInfo, setShowInfo] = useState(false)
    const [showIcon, setShowIcon] = useState(true)

    function handleClick() {
        setShowInfo(prevShowInfo => !prevShowInfo);
        setShowIcon(prevShowInfo => !prevShowInfo)
      }

      
return (
    <>
    <div className="info">

        {showIcon && (
        <FaInfo alt="Info" size={30} color="white"
            className="info-image"
            onClick={handleClick}/>
        )}

        {showInfo && (
        <div className="info-content">
            <button className="close-button" onClick={handleClick}>
                &times;
            </button>
            <img src="Source_info.jpg" alt="Info Content" />
            <p>Natural and anthropogenic events that
                originate seismic signals  <br />in different frequency range. (Flores-Estrella et al, 2023)</p>
        </div>
        )}
    </div>

    <div className="legend">
      <div className="legend-item">
        <div className="legend-color" style={{ background: 'red' }}></div>
        <div className="legend-label">Rayleigh Waves</div>
      </div>
      <div className="legend-item">
        <div className="legend-color" style={{ background: 'blue' }}></div>
        <div className="legend-label">Other Waves</div>
      </div>
      <div>
      <div className="source-color-label">Source Density</div>

      <div className="source-legend-colorbar">

        <div className="source-colorbar-mark" style={{ left: '0%'}}>0</div>
        <div className="source-colorbar-mark" style={{ left: '20%'}}>0.2</div>
        <div className="source-colorbar-mark" style={{ left: '40%'}}>0.4</div>
        <div className="source-colorbar-mark" style={{ left: '60%'}}>0.6</div>
        <div className="source-colorbar-mark" style={{ left: '80%'}}>0.8</div>
        <div className="source-colorbar-mark" style={{ right: '0%'}}>1</div>
      </div>

      <br/>
      <div className="HV-color-label">H/V ratio</div>
      <div className="HV-legend-colorbar">

        <div className="HV-colorbar-mark" style={{ left: '0%'}}>0.0</div>
        <div className="HV-colorbar-mark" style={{ left: '20%'}}>0.4</div>
        <div className="HV-colorbar-mark" style={{ left: '40%'}}>0.8</div>
        <div className="HV-colorbar-mark" style={{ left: '60%'}}>1.2</div>
        <div className="HV-colorbar-mark" style={{ left: '80%'}}>1.6</div>
        <div className="HV-colorbar-mark" style={{ left: '100%'}}>2.0</div>
      </div>

      </div>
    </div>
    </>
  );
}