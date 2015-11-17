// Import dependecies
import React from 'react';
import ReactDOM from 'react-dom';


// This Time component handle the elapsed time
// when component is mounted on page load
var Time = React.createClass({

	// set default time properties
	getDefaultProps: function(){
		return {
			timing: 20
		}
	},


	// Get the deault state properties of this component
	getInitialState: function( ) {
		return {
			active: false,
			elapsed: 0,
			secondsElapsed: 0,
			maxSave: 3
		};
	},


	// Get elapsed milliseconds
	getPrimes: function( ){
		var primes = ( "0" + Math.round( this.state.elapsed  / 10 )).slice( -2 );
		return primes;
	},


	// Get elapsed seconds
	getSeconds: function( ){
		var seconds = ("0" + this.state.secondsElapsed % 60).slice( -2 );
		return seconds;
	},


	// Get elapsed minutes
	getMinutes: function ( ) {
		return Math.floor( this.state.secondsElapsed / 60 );
	},


	// Reset timer
	resetTimer: function( ) {
		// restart time when time is saved
		this.setState({
			secondsElapsed: 0,
			elapsed: 0
		});
	},


	// Clear the timer theration
	clearTimer: function () {
		clearInterval( this.timer );
	},


	// Handle the click event to stop/start timer
	handleStart: function( ) {

		// update active state (false if true, true if false)
		this.setState({
			...this.state,
			active: !this.state.active,
		});

		// Set the timer and states update.
		// This timer will update elapsed times
		// state and refresh the render

		if ( !this.state.active ) {
			this.timer = setInterval( ( ( ) => {

				// Update primes state
				this.state.elapsed = this.state.elapsed + this.props.timing;
				this.setState({
					elapsed: this.state.elapsed
				});

				// check if elapsed reach 1000 then incremet secondsElapsed
				if ( this.state.elapsed % 1000 == 0 ) {
					this.setState({
						secondsElapsed: ( this.state.secondsElapsed + 1 ),
					});
				}
			} ).bind( this ), this.props.timing );
		}

		// Reset counter time
		else { this.clearTimer(); }
	},


	// handle the stop funciton
	handleStop: function( ) {

		// stop and clear timer
		clearInterval( this.timer );

		// reset timer values
		this.setState({
			...this.state,
			secondsElapsed: 0,
			elapsed: 0,
			active: false
		});
	},


	// Save the current time
	saveTime: function( ) {

		// push current time to saveTime() method if maxSave
		if ( this.state.maxSave != 0 && this.state.maxSave > 0 ) {
			this.props.saveTimeCallback( `${this.getMinutes()}:${this.getSeconds()}:${this.getPrimes()}` );
			this.state.maxSave--;

			if ( this.state.maxSave == 0 ) {
				this.handleStop();
				this.resetTimer();
			}
		}
		else {
			this.handleStop();
		}

		// call reset method
		this.resetTimer();
	},


	// Render Time component
	render: function( ) {
		return (
			<div className="c-counter-display">
				{/* Timer */}
				<h1 className="c-counter__time"> { this.getMinutes() }:{ this.getSeconds() }:{ this.getPrimes() } </h1>

				{/* Timer controls */}
				<button disabled={( this.state.elapsed == 0 ? 'disabled' : '') } className="c-counter__controller" onClick={this.handleStop}><span>◼︎</span></button>
				<button className={ "c-counter__controller  c-counter__controller--play" + ( this.state.active ? ' isActive' : '' ) } onClick={this.handleStart}><span>{( this.state.active ? 'II' : '►' )}</span></button>
				<button disabled={( this.state.maxSave == 0 || !this.state.active ? 'disabled' : '') } className="c-counter__controller" onClick={ ( this.state.active ? this.saveTime : '' ) } ><span>✔︎</span></button>
			</div>
		);
	}
})


// This Counter component display a custom message and the Time component
var Counter = React.createClass({

	// Get initial state for this component
	getInitialState: function() {
		return {
			savedTimes: []
		}
	},


	// Get and save the current time
	saveTimeCallback: function ( time ) {

		// add new saved time to savedTime state
		this.state.savedTimes.push( time );

		this.setState({
			...this.state,
			savedTimes: Array.apply( [ ], this.state.savedTimes )
		});

	},

	eraseList: function () {
		this.refs.item0.emptySaved();
	},


	// Render the Counter component
	render: function() {
		return (
			<div className="c-counter" >

				{/* Show time */}
				<Time saveTimeCallback={this.saveTimeCallback} timing={20} />

				{/* Show saved time */}
				<ul className="c-counter-timelist">
						{/* Print each saved time */}
						{this.state.savedTimes.map( ( time, i ) => (
							<li className="c-counter-timelist__time" >
								<strong>✔︎</strong>{time}"
							</li>
						) )}
				</ul>

			</div>
		);
	}
});


// Render the react DOM components
ReactDOM.render(
	<Counter />,
	document.getElementById('c-container')
);
