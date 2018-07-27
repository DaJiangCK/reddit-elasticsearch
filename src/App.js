import React, { Component } from 'react';
import elasticsearch from 'elasticsearch';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: []
		};

	}

	componentWillMount() {
		console.log('this function works');
		//Elasticsearch Client Request
		// const client = new elasticsearch.Client({
			// host: 'localhost:9200',
			// log: 'trace'
		// });
		// const exists = client.getSource({
			// index: 'redditnba',
			// type: 'post',
			// id: 1
		// })
		// .then(result => {
			// console.log(result);
		// });
		
		//Axios Request
		//  axios.get('http://localhost:9200/redditnba/post/_search')
      	// .then(res => {
		// 	console.log(res);
      	// })
	}

	mainButtonClick() {
		console.log('main button clicked');
		this.setState({
			data: ['anotherone.ca', 'hckrnews.com']
		});
	}

	render() {
		return (
			<div className="App">
				<ul>
					{
						this.state.data.map((item, i) => {
							return (<li key={i}>{item}</li>)
						})
					}
				</ul>
				<button onClick={() => {this.mainButtonClick()}}>Click Me</button>
			</div>
		);
	}
}

export default App;
