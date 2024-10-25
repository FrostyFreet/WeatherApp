import axios from 'axios'
import {useEffect, useState} from "react";

const weatherApi = import.meta.env.VITE_WEATHER_API_KEY;
const geoLocationApi = import.meta.env.VITE_GEOLOCATION_API_URL;
function App() {
    const[inputValue,setInputValue]=useState("")
    const[inputValue2,setInputValue2]=useState("")
    const [data,setData]=useState({
        temp:"",
        location:"",
        country:""
    });

    useEffect(() => {
        const fetchGeoLocation=async()=>{
            await axios
                .get(geoLocationApi)
                .then((response) =>{
                    setInputValue2(response.data.city)}
                )
                .catch((error)=>{
                    console.log(error.message)})
        }
        fetchGeoLocation()
    }, []);


    useEffect(()=>{
        if(inputValue2) {
            const fetchWeather = async () => {
                await axios
                    .get(`http://api.weatherapi.com/v1/current.json?key=${weatherApi}&q=${inputValue2}`)
                    .then((response) => {
                        setData({
                            temp: response.data.current.feelslike_c,
                            location: response.data.location.name,
                            country: response.data.location.country
                        })
                    })
            }
            fetchWeather()
        }

    },[inputValue2])

    function handleInputChange(e){
        setInputValue(e.target.value)
    }
    function handleSubmit(e){
        e.preventDefault()
        const city=inputValue ||inputValue2
        axios
            .get(`http://api.weatherapi.com/v1/current.json?key=${weatherApi}&q=${city}`)
            .then((response)=>{
                const temp=response.data.current.feelslike_c
                const location=response.data.location.name
                const country=response.data.location.country
                setData({
                        temp:temp,
                        location: location,
                        country: country
                    }
                )
            })
            .catch((error)=>{
                console.log(error.message)
            })
    }
    return (
        <>
          <form onSubmit={handleSubmit}>
              <label>Enter your City:
                  <input name={"city"} type="text" value={inputValue} onChange={handleInputChange} placeholder={inputValue2 || "Enter a city name"}/>
              </label>
              <p>The temperature is {data.temp} in {data.location} {data.country}</p>
              <button type={"submit"}>Search</button>
          </form>
        </>
      )
}

export default App
