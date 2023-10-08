import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Historical events map</h1>
            This web app shows historical events on a world map.
            <br/>
            🚧 Is currently work in progress. 🚧
            <br/>
            <a href="./map-event">Go to Map Event</a>
            <br />
            <br />
            I was inspired by the website <a href="https://runkartan.se/english/">runkartan</a>.
      </div>
    );
  }
}
