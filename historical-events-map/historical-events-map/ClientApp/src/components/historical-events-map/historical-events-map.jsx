import './styles.css'
import MapComponent, { initializeMap, addMarker, addPolygon, clearMarkers } from './mapsInterop.js';
import React, { Component, createRef } from 'react';
import axios from 'axios';

export class HistoricalEventsMap extends Component {
    static displayName = HistoricalEventsMap.name;

    //
    // For geting data from database
    //

    storedEvents = []; // event data

    handleFetchButtonClick = () => {
        const topics = this.getSelectedTopics();
        if (topics.length > 0) {
            this.fetchEventsByTopic(topics);
        } else {
            clearMarkers();
            this.storedEvents = [];
        }
    }

    getSelectedTopics = () => {
        const topicIDs = ["Book", "Author", "Test"];
        const selectedTopics = [];

        topicIDs.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                selectedTopics.push(checkbox.value);
            }
        });

        return selectedTopics;
    }

    fetchEventsByTopic = async (topicsArray) => {
        try {
            const topicsString = topicsArray.join(",");
            const response = await axios.get(`/api/historicalevents?topics=${topicsString}`);
            const data = response.data;
            //console.log(data);
            this.storedEvents = data;
            this.setState({ storedEvents: data });
            this.displayResultsWithYearFilter();
        } catch (error) {
            console.error("There was an error fetching data", error);
        }
    }

    displayResultsWithYearFilter = () => {
        const leftYear = this.state.leftValue;
        const rightYear = this.state.rightValue;

        const filteredEvents = this.storedEvents.filter(event =>
            leftYear <= event.startYear && event.startYear <= rightYear
        );

        this.displayResults(filteredEvents);
    }

    displayResults = (events) => {
        clearMarkers(); // clear the map

        events.forEach(event => {
            if (event.coordinates !== 'N/A') {
                this.addMarkerFromEvent(event);
            } else if (event.PolygonData !== 'N/A') {
                this.addPolygonCoords(event);
            }
        });
    }

    addMarkerFromEvent = (event) => {
        let strCoor = event.coordinates;
        let parts = strCoor.split(',').map(part => parseFloat(part.trim()));
        let lat = parts[0];
        let lng = parts[1];

        var strDescription = `${event.eventName}, ${event.topic}, year ${event.startYear}`;
        addMarker(lat, lng, strDescription);
    }

    addPolygonCoords = (event) => {
        // Split by semicolon first
        let pairs = event.polygonData.split(';');

        // Then for each pair, split by comma and map to float
        let coords = pairs.map(coord => {
            let parts = coord.split(',').map(part => parseFloat(part.trim()));
            return [parts[0], parts[1]]; // Return as an array of lat, lng pairs
        });
        addPolygon(coords);
    }

    //
    // slider
    //

    state = {
        leftValue: 500,
        rightValue: 1500
    };

    // Create refs for DOM elements
    leftThumbRef = createRef();
    rightThumbRef = createRef();
    rangeElementRef = createRef();
    leftValueNumberRef = createRef();
    rightValueNumberRef = createRef();
    trackRef = createRef();

    componentDidMount() {
        document.title = "Historical events map";
    }

    componentDidMount() {
        document.title = "Historical events map";
        initializeMap("map");

        // example
        /*addMarker(48.52411, 9.61254, 'Test'); 
        const polygonCoords = [
            [51.44267, -1.1633],
            [41.0353, -0.14675],
            [46.1360, 19.6429],
        ];
        addPolygon(polygonCoords);/**/

        //---

        // Filtering the input to accept only numbers
        this.filterInputToNumbers(this.leftValueNumberRef);
        this.filterInputToNumbers(this.rightValueNumberRef);

        // Initialization for the thumbs
        const trackWidth = this.trackRef.current.offsetWidth - this.leftThumbRef.current.offsetWidth; // Total draggable width
        const leftInitialRatio = (500 - 500) / 1000; // (value - min) / span
        const rightInitialRatio = (1500 - 500) / 1000; // (value - min) / span

        this.leftThumbRef.current.style.left = leftInitialRatio * trackWidth + 'px';
        this.rightThumbRef.current.style.left = rightInitialRatio * trackWidth + 'px';
        this.rangeElementRef.current.style.left = (this.leftThumbRef.current.offsetLeft + this.leftThumbRef.current.offsetWidth / 2) + 'px';
        this.rangeElementRef.current.style.width = (this.rightThumbRef.current.offsetLeft - this.leftThumbRef.current.offsetLeft) + 'px';

        this.setState({
            leftValue: 500,
            rightValue: 1500
        });

        this.updateValues(); // Set the initial values

        // Bind the mousedown event
        document.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseDown = (e) => {
        if (e.target === this.leftThumbRef.current || e.target === this.rightThumbRef.current) {
            this.activeThumb = e.target === this.leftThumbRef.current ? 'left' : 'right';
            document.addEventListener('mousemove', this.dragThumb);
        } else if (e.target === this.rangeElementRef.current) {
            this.activeThumb = 'range';
            this.initialMousePosition = e.clientX;
            this.initialLeftThumbPosition = this.leftThumbRef.current.offsetLeft;
            this.initialRightThumbPosition = this.rightThumbRef.current.offsetLeft;
            document.addEventListener('mousemove', this.dragRange);
        }
    }

    handleMouseUp = () => {
        this.activeThumb = null;
        document.removeEventListener('mousemove', this.dragThumb);
        document.removeEventListener('mousemove', this.dragRange);
    }

    dragThumb = (e) => {
        const rect = this.trackRef.current.getBoundingClientRect();

        if (this.activeThumb === 'left' && e.clientX <= this.rightThumbRef.current.getBoundingClientRect().left && e.clientX > rect.left) {
            this.leftThumbRef.current.style.left = e.clientX - rect.left + 'px';
        } else if (this.activeThumb === 'right' && e.clientX >= this.leftThumbRef.current.getBoundingClientRect().right && e.clientX < rect.right) {
            this.rightThumbRef.current.style.left = e.clientX - rect.left + 'px';
        }

        this.rangeElementRef.current.style.left = (this.leftThumbRef.current.offsetLeft + this.leftThumbRef.current.offsetWidth / 2) + 'px';
        this.rangeElementRef.current.style.width = (this.rightThumbRef.current.offsetLeft - this.leftThumbRef.current.offsetLeft) + 'px';
        this.updateValues();
    }

    dragRange = (e) => {
        const rect = this.trackRef.current.getBoundingClientRect();
        const rangeWidth = this.rangeElementRef.current.offsetWidth;
        const distanceMoved = e.clientX - this.initialMousePosition;

        let newLeftThumbPosition = this.initialLeftThumbPosition + distanceMoved;
        let newRightThumbPosition = this.initialRightThumbPosition + distanceMoved;

        if (newLeftThumbPosition < 0) {
            newLeftThumbPosition = 0;
            newRightThumbPosition = rangeWidth;
        } else if (newRightThumbPosition > rect.width) {
            newRightThumbPosition = rect.width;
            newLeftThumbPosition = rect.width - rangeWidth;
        }

        this.leftThumbRef.current.style.left = newLeftThumbPosition + 'px';
        this.rightThumbRef.current.style.left = newRightThumbPosition + 'px';
        this.rangeElementRef.current.style.left = (this.leftThumbRef.current.offsetLeft + this.leftThumbRef.current.offsetWidth / 2) + 'px';
        this.updateValues();
    }

    updateValues = () => {
        const totalWidth = this.trackRef.current.offsetWidth - this.leftThumbRef.current.offsetWidth;
        const leftPercent = this.leftThumbRef.current.offsetLeft / totalWidth;
        const rightPercent = this.rightThumbRef.current.offsetLeft / totalWidth;

        const leftValue = Math.round(500 + (1000 * leftPercent));
        const rightValue = Math.round(500 + (1000 * rightPercent));

        this.setState({
            leftValue: leftValue,
            rightValue: rightValue
        });

        this.displayResultsWithYearFilter();
    }

    filterInputToNumbers = (inputElement) => {
        let oldValue;  // To store the old value

        inputElement.current.addEventListener('focus', (e) => {
            oldValue = e.target.value;
        });

        inputElement.current.addEventListener('blur', (e) => {
            let value = parseInt(e.target.value, 10);

            if (isNaN(value) || value < 500 || value > 1500) {
                e.target.value = oldValue;
            } else {
                //this.updateValues();
            }
        });
    }

    render() {
        return (
            <div className="App">
                <MapComponent />
                <section className="checkbox-slider-container">
                    <input type="checkbox" id="Book" name="Book" value="Book" />
                    <label htmlFor="Book"> Books</label>
                    <input type="checkbox" id="Author" name="Author" value="Author" />
                    <label htmlFor="Author"> Authors</label>
                    <input type="checkbox" id="Test" name="Test" value="Test" />
                    <label htmlFor="Test"> Test</label>
                    <button id="fetchButton" onClick={this.handleFetchButtonClick}>Show</button>
                    {/*
                     * TODO:
                     * need a js library for double range slider controls (range slider)
                     */}
                    <div className="range-slider">
                        <div className="track" ref={this.trackRef}></div>
                        <div className="thumb thumb-left" ref={this.leftThumbRef}></div>
                        <div className="thumb thumb-right" ref={this.rightThumbRef}></div>
                        <div className="range" ref={this.rangeElementRef}></div>
                    </div>
                    <input type="text" id="leftValueNumber" ref={this.leftValueNumberRef} value={this.state.leftValue} onChange={(e) => this.setState({ leftValue: e.target.value })} style={{ width: '50px' }} maxLength="4" />
                    <input type="text" id="rightValueNumber" ref={this.rightValueNumberRef} value={this.state.rightValue} onChange={(e) => this.setState({ rightValue: e.target.value })} style={{ width: '50px' }} maxLength="4" />
                    <b>⚠️ Site Under Construction</b>
                    Thank you for visiting. Our site is still being finalized, so some information may change or be inaccurate. We appreciate your patience and understanding.
                </section>
            </div>
        );
    }
}
