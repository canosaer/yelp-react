import './styles/main.scss'
import { useDebounce } from './utilities';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const [searchTerm, setSearchTerm ] = useState('')
  const [location, setLocation ] = useState('')
  const [sort, setSort ] = useState('best_match')
  const [radius, setRadius ] = useState('25')
  const [results, setResults] = useState([])
  const [openNow, setOpenNow] = useState(false)
  const [priceArray, setPriceArray] = useState([])
  const [priceString, setPriceString] = useState('1, 2, 3, 4')
  const [priceMenuExpanded, setPriceMenuExpanded] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const debouncedLocation = useDebounce(location, 500)

  const updatePriceFilters = (e) => {
    let updatedPriceArray = priceArray
    const selectedBox = e.target.name
    if(priceArray.includes(selectedBox)){
        updatedPriceArray = priceArray.filter(box => box != selectedBox)
    }
    else{
        updatedPriceArray = priceArray.push(selectedBox)
    }
    setPriceArray(updatedPriceArray)

    let updatedPriceString = ''
    if(updatedPriceArray.includes('$')) updatedPriceString = updatedPriceString + '1, '
    else if(updatedPriceArray.includes('$$')) updatedPriceString = updatedPriceString + '2, '
    else if(updatedPriceArray.includes('$$$')) updatedPriceString = updatedPriceString + '3, '
    else if(updatedPriceArray.includes('$$$$')) updatedPriceString = updatedPriceString + '4, '
    else updatedPriceString = '1, 2, 3, 4, '

    updatedPriceString.slice(0, updatedPriceString.length-2)

    setPriceString(updatedPriceString)
  }


  const getBusinesses = async (termInput, locationInput) => {
    const searchLocation = locationInput ? locationInput : "Atlanta, GA"

    const distance = parseInt(radius.substring(0,2).trim()) * 800

    const data = {
      _ep: `/businesses/search`,
      term: termInput,
      location: searchLocation,
      sort_by: sort,
      radius: distance,
      open_now: openNow,
      price: priceString,
    }

    const headers = {
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
    }

    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL, { params: data, headers: headers })
      console.log(response.data.businesses)
      setResults(response.data.businesses)
    } catch (err) {
      console.log(err.message, err.code)
    }
  }

  useEffect(() => {
    if(debouncedSearchTerm || debouncedLocation){
      getBusinesses(debouncedSearchTerm, debouncedLocation)
    } else{
      setResults([])
    }
  }, [debouncedSearchTerm, debouncedLocation])


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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

				<div className="search-menu">
          <select name="sort" className="search-menu__sort-list" id="sort" onChange={(e) => setSort(e.target.value)}>
            <option className="search-menu__item search-menu__item_relevance" value="best_match">Sort by Relevance</option>
            <option className="search-menu__item search-menu__item_rating" value="rating">Sort by Rating</option>
            <option className="search-menu__item search-menu__item_count" value="review_count">Sort by # Reviews</option>
            <option className="search-menu__item search-menu__item_distance" value="distance">Sort by Distance</option>
          </select>
				</div>

				<div className="price-range"><span className="price-range__toggle" onClick={() => setPriceMenuExpanded(!priceMenuExpanded)}>Price Range <span className="price-range__symbol">{priceMenuExpanded ? "<>" : "><"}</span></span>
					<div className={priceMenuExpanded ? "price-range__input" : "price-range__input hidden"}>
						<input className="price-range__checkbox" id="$" name="$" type="checkbox" onClick={(e) => updatePriceFilters(e)} />
						<label className="price-range__label">$</label>
						<input className="price-range__checkbox" id="$$" name="$$" type="checkbox" onClick={(e) => updatePriceFilters(e)} />
						<label className="price-range__label">$$</label>
						<input className="price-range__checkbox" id="$$$" name="$$$" type="checkbox" onClick={(e) => updatePriceFilters(e)} />
						<label className="price-range__label">$$$</label>
						<input className="price-range__checkbox" id="$$$$" name="$$$$" type="checkbox" onClick={(e) => updatePriceFilters(e)} />
						<label className="price-range__label">$$$$</label>
					</div>
				</div>
        <div className="radius-menu">
          <p className="radius-menu__within">Within</p>
          <select name="sort" className="radius-menu__list" id="radius" defaultValue="25" onChange={(e) => setRadius(parseInt(e.target.id))}>
            <option className="radius-menu__item radius-menu__item_5" value="5">5 miles</option>
						<option className="radius-menu__item radius-menu__item_15" value="15">15 miles</option>
						<option className="radius-menu__item radius-menu__item_25" value="25">25 miles</option>
						<option className="radius-menu__item radius-menu__item_50" value="50">50 miles</option>
          </select>
				</div>
				<div className="open-now">
					<label className="open-now__label">Open Now</label>
					<input className="open-now__checkbox" id="open" name="open" type="checkbox" onClick={() => setOpenNow(!openNow)}/>
				</div>
			</section>
			<section className="results">
			</section>
		</main>
  );
}

export default App;
