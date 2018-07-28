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
		
		// Axios Request
		 axios.get('http://localhost:9200/redditnba/post/_search?size=25')
      	.then(res => {
			this.setState({
				data: res.data.hits.hits
			});
      	});
	}

	mainButtonClick() {
		console.log('main button clicked');
		const searchQuery = {
    		query: { 
				match: { 
					"title": this.state.searchValue
				} 
			}
  		};

		axios.get('http://localhost:9200/redditnba/post/_search', {params: {
			source: JSON.stringify(searchQuery),
			source_content_type: 'application/json'
		}})
		.then(res => {
			// console.log(res);
			// console.log(res.data.hits.hits);
			this.setState({
				data: res.data.hits.hits
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
							return (<li key={i}><a href={document._source.url}>{document._source.title}</a></li>)
						})
					}
				</ul>
				<button onClick={() => {this.mainButtonClick()}}>Click Me</button>
			</div>
		);
	}
}

export default App;
