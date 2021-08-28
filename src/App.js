import { useState } from 'react';
import ConfigKeys from './config';


function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState('');
  const [photos, setPhotos] = useState([]);


  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${ConfigKeys.api_url}weather?q=${query}&units=metric&APPID=${ConfigKeys.api_key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${ConfigKeys.api_img}`
          )
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                throw new Error("You made a mistake");
              }
            })
            .then((data) => {
              console.log(data);
              setPhotos(data?.results[0]?.urls?.raw);
            })
            .catch((error) => console.log(error));
          console.log(weather);
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  return (
    <div className={
      (typeof weather.main != "undefined")
        ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search your favorite location..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}ºc
              </div>
              <div className="weather">
                {weather.weather[0].main}
              </div>
              <div>
                <img className="local_img" src={photos} alt="" />
              </div>
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
