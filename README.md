# 1. TRANS (Taiwan Real-time Ambient Noise System)
### TRANS is a real-time system to monitor ambient noise data with 40 seismic staions across Taiwan. Aims to analyze and quantify Taiwan’s ambient noise characteristics to monitor corresponding meteorological events, tectonic activities, and anthropogenic activities. This project uses front-end and back-end separate development. The front-end is for web page display and data visualization. It is mainly implemented using `React.js` and receives real-time data from the back-end. The back-end is divided into data pre-processing, data scientific calculation, and real-time data transmission of front-end and back-end. Mainly using `Python` to process seismic data and `Flask` as a lightweight back-end.

# 2. Process flow
![Process flow.](https://github.com/paui0615/TRANS/assets/125962545/1d30b615-2489-4bb2-8485-6b0c6e675859)

# 2. Backend
## Data pre-processing and science
### This part of the code has not been released to the public because it is confidential. It mainly uses the python library `seedlink` to receive the seismic real-time raw waveform, and uses `obspy` for waveform pre-processing (including bandpass filtering, resample, taper, etc.). Further estimates the ellipticity, polarization degree and Azimuth. And through data analysis, rose diagrams, source maps and seismic velocity changes are produced.
## Sending processed real-time data
###  In `./api` folder, `api.py` will package the real-time azimuth diagrams obtained by data analysis into a json file and send it to the front-end with `socketio`, updating every 5 minutes.
```
$ python api/api.py
```

# 3. Front-end
### The web development is built up by React.js. I use `react-bootstrap` to construct the grid system of the web. There are also some techniques help me to complete it (./src/components):
* App.js: The `socket` module can realize real-time data transmission. The `mapboxgl` is a map tool to show Taiwan's map with all the seismic stations with historical data and source map every hour.
* Source.js: The component is used to define source maps with different frequency ranges by clicking buttons.
* Legend.js: The component builds up the legend of source map density and H/V ratios.
```
In ./ folder:
$ npm start
```

# 4. Web display

# Citations
- [Controls on Seasonal Variations of Crustal Seismic Velocity in Taiwan Using Single-Station Cross-Component Analysis of Ambient Noise Interferometry. (Feng et al., 2021)](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2021JB022650)
- [Constraining S-wave velocity using Rayleigh wave ellipticity from polarization analysis of seismic noise. (Berbellini et al., 2019)](https://academic.oup.com/gji/article/216/3/1817/5222650)
- [DOP-E Github](https://github.com/berbellini/DOP-E)
