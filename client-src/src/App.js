import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			searchValue: ''
		};
	}

	componentWillMount() {
		console.log('this function works');
		axios.get('http://localhost:3000/api/posts')
		.then(res => {
			console.log(res);
			this.setState({
				data: res.data
			});
		})
	}

	mainButtonClick() {
		console.log('main button clicked');
		axios.get('http://localhost:3000/api/posts/search',  {
			params: { 
				text: this.state.searchValue
			}
		})
		.then(res => {
			console.log(res);
			this.setState({
				data: res.data.results
			});
		});

	}

	updateSearchValue (evt) {
		this.setState({
			searchValue: evt.target.value
		});
  	}

	render() {
		return (
			<div className="App">
				<input type="text" value={this.state.searchValue} onChange={evt => this.updateSearchValue(evt)} style={{marginTop: "10px"}}></input>
				<ul>
					{
						this.state.data.map((document, i) => {
							return (<li key={i}><a href={document.url}>{document.title}</a></li>)
						})
					}
				</ul>
				<button onClick={() => {this.mainButtonClick()}}>Click Me</button>
			</div>
		);
	}
}

export default App;
