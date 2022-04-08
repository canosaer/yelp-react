import './styles/main.scss'
import search from './img/magnifying-glass.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebounce } from './utilities';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const [searchTerm, setSearchTerm ] = useState('')
  const [location, setLocation ] = useState('Atlanta, GA')
  const [sort, setSort ] = useState('best_match')
  const [radius, setRadius ] = useState('25')
  const [results, setResults] = useState([])
  const [priceMenuExpanded, setPriceMenuExpanded] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const apiKey = process.env.REACT_APP_API_KEY;
  const baseURL = process.env.REACT_APP_BASE_URL;



  // process.env.REACT_APP_API_KEY


  const handleSearch = () => {
    let selectedSort = `best_match`
    if(this.sortText.textContent.indexOf(`Rating`) !== -1) selectedSort = `rating`
    else if(this.sortText.textContent.indexOf(`Reviews`) !== -1) selectedSort = `review_count`
    else if(this.sortText.textContent.indexOf(`Distance`) !== -1) selectedSort = `distance`

    const distance = parseInt(this.radiusText.textContent.substring(0,2).trim()) * 800
    console.log(distance)

    const openNow = document.querySelector(`.open-now__checkbox`).checked

    let priceString = ``
    const priceChecks = document.querySelectorAll(`.price-range__checkbox`)
    for(let i=0;i<4;i++){
        if (priceChecks[i].checked) priceString += `${i+1}, `
    }
    if(priceString === `` || this.priceFilter===false) priceString = `1, 2, 3, 4, `
    priceString = this.removeLastComma(priceString)

    const data = {
        _ep: `/businesses/search`,
        term: searchTerm,
        location: location,
        sort_by: sort,
        radius: distance,
        open_now: openNow,
        price: priceString,
    }

    const headers = {
        Authorization: `Bearer ${this.API_KEY}`
    }

    axios.get(this.API_BASE_URL, { params: data, headers: headers }).then(this.processResults)
}


  const getBusinesses = async (url, query) => {
    try {
      const response = await axios.get(`${url}&query=${query}`)
      console.log(response)
      setResults(response.data.results)
    } catch (err) {
      console.log(err.message, err.code)
    }
  }


  return (
		<main className="display-grid">
			<a className="site-heading" href="https://www.yelp.com/" target="_blank">Yelp</a>
			<h2 className="site-heading__subheading">Business Search</h2>
			<section className="search-controls">
				<p className="article-count"></p>
        <input className="search-controls__input search-controls__input_term" id="term" name="term" placeholder="business" type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input className="search-controls__input search-controls__input_location" id="location" name="location" placeholder="location" type="text" 
          value={searchTerm}
          onChange={(e) => setLocation(e.target.value)}
        />

				<div className="search-menu">
          <select name="sort" className="search-menu__sort-list" id="sort" onChange={(e) => setSort(e.target.id)}>
            <option className="search-menu__item search-menu__item_relevance" value="Relevance">Sort by Relevance</option>
            <option className="search-menu__item search-menu__item_rating" value="Rating">Sort by Rating</option>
            <option className="search-menu__item search-menu__item_count" value="Reviews">Sort by # Reviews</option>
            <option className="search-menu__item search-menu__item_distance" value="Distance">Sort by Distance</option>
          </select>
				</div>

				<div className="price-range"><span className="price-range__toggle" onClick={() => setPriceMenuExpanded(!priceMenuExpanded)}>Price Range <span className="price-range__symbol">{priceMenuExpanded ? "<>" : "><"}</span></span>
					<div className={priceMenuExpanded ? "price-range__input" : "price-range__input hidden"}>
						<input className="price-range__checkbox" id="$" name="$" type="checkbox" />
						<label className="price-range__label">$</label>
						<input className="price-range__checkbox" id="$$" name="$$" type="checkbox" />
						<label className="price-range__label">$$</label>
						<input className="price-range__checkbox" id="$$$" name="$$$" type="checkbox" />
						<label className="price-range__label">$$$</label>
						<input className="price-range__checkbox" id="$$$$" name="$$$$" type="checkbox" />
						<label className="price-range__label">$$$$</label>
					</div>
				</div>
        <div className="radius-menu">
          <p className="radius-menu__within">Within</p>
          <select name="sort" className="radius-menu__list" id="radius" onChange={(e) => setRadius(e.target.id)}>
            <option className="radius-menu__item radius-menu__item_5" value="5">5 miles</option>
						<option className="radius-menu__item radius-menu__item_15" value="15">15 miles</option>
						<option className="radius-menu__item radius-menu__item_25" value="25" selected>25 miles</option>
						<option className="radius-menu__item radius-menu__item_50" value="50">50 miles</option>
          </select>
				</div>
				<div className="open-now">
					<label className="open-now__label">Open Now</label>
					<input className="open-now__checkbox" id="open" name="open" type="checkbox" />
				</div>
			</section>
			<section className="results">
			</section>
		</main>
  );
}

export default App;
