import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Button from './Button'
import Table from './Table'
import axios from 'axios'
import { DEFAULT_HPP, PATH_BASE, PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE, PARAM_HPP} from './constants.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      originalURL: '',
      shortURL: '',
      code: '',
      error: null,
      results: '',
    }

    this.onSearchChange = this.onSearchChange.bind(this)
    this.urlRoute = this.urlRoute.bind(this)
    this.onRedirect = this.onRedirect.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
  }

  urlRoute(event) {
    const originalURL = this.state.originalURL
    axios.post('http://localhost:3001/api/shortenurl', { originalURL: originalURL })
      .then((response) => {
        if (response.data.success) this.setState({ shortURL: response.data.shortURL, code: response.data.code, error: null})
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
    event.preventDefault()
  }

  onSearchChange(event) {
    this.setState({originalURL: event.target.value, shortURL: ''})
    
  }

  onRedirect() {
    const code = this.state.code
    const BASE_URL = 'http://localhost:3001/api/geturl/'
    axios.get(`${BASE_URL}${code}`)
      .then((response) => {
        if (response.data.success) console.log('successfully redirected')
      })
      .catch((err) => {
        console.log('failed to redirect', err);
      })
  }

  onSearchSubmit(event) {
    const { originalURL, code } = this.state
    if (originalURL && code) {
      this.fetchSearchTopStories(code)
      event.preventDefault()
    } else {
      this.setState({ error: "Please enter a valid url"})
    }
  }

  setSearchTopStories(result) {
    const { code } = this.state
    const { hits, page } = result
    const { results } = this.state

    const oldHits = results && results[code] ? results[code].hits : []
    const updatedHits = [...oldHits, ...hits]
    
    this.setState({ results: {...results, [code]: {hits: updatedHits, page }}})
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }))
  }

  render() {
    const { originalURL, shortURL, results, error, code } = this.state
    const page = (results && results[code] && results[code].page) || 0
    const list =(results && results[code] && results[code].hits) || []

    return (
      <div className="page">
          <div style={{paddingTop: '60px'}}>
              <p className="big-paragraph blue">Paster your URL</p>
              <form onSubmit={(event) => this.urlRoute(event)}>
                <input type="text" value={originalURL} onChange={this.onSearchChange} className="long-input-form" />
                <button type="submit" className="small-button-blue">SHORTEN URL</button>
              </form>
            </div>
        <form onSubmit={(event) => this.urlRoute(event)}>
            <input type="text" value={shortURL} onChange={this.onSearchChange} className="long-input-form" />
            <Button onClick={this.onRedirect}>LET'S GO</Button>
            <p className="note">*Please <a href='https://www.google.com/search?q=fix+cors+issue+in+chrome&oq=fix&aqs=chrome.0.69i59j69i57j69i65j69i60l3.793j0j9&sourceid=chrome&ie=UTF-8'>add chrome extension</a> to fix the<a href='https://www.codecademy.com/articles/what-is-cors'>CORS issue</a></p>
        </form>

        <span>
          <Button onClick={this.onSearchSubmit}>About the URL</Button>
        </span>
        { error 
          ? <div className="interactions">
             <p>{error}</p>
           </div>
          : <Table list={list} />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(code, page + 1)}>More</Button>
        </div>
      </div>
    );
  }

}

export default App;
