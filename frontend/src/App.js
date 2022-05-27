import Map, { Marker, Popup } from "react-map-gl";
import { GeoAltFill, StarFill } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
const getPins = async () => {
  try {
    const res = await axios.get("pins");
    return res.data;
  } catch (error) {}
};

function App() {
  const [fontSize, setfontSize] = useState("15px");
  const [pins, setpins] = useState([]);
  const [currentPalceId, setCurrentPlaceId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(
    localStorage.getItem("user") || ""
  );
  const [newPalce, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const handlAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lng,
      lat,
    });
  };
  useEffect(() => {
    getPins().then((payload) => {
      setpins(payload.pins);
    });
  }, [getPins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPalce.lat,
      long: newPalce.lng,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setpins([...pins, res.data.newPin]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };
  return (
    <div>
      <Map
        initialViewState={{
          longitude: 40.4,
          latitude: 2,
          zoom: 2,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onZoom={(e) => {
          setfontSize(`${parseInt(e.viewState.zoom) * 7}px`);
        }}
        onDblClick={handlAddClick}
      >
        {pins.map((pin) => {
          return (
            <div key={pin._id}>
              <Marker longitude={pin.long} latitude={pin.lat}>
                <GeoAltFill
                  style={{
                    color:
                      pin.username === currentUsername ? "tomato" : "slateblue",
                    fontSize: fontSize,
                  }}
                  onMouseEnter={() => {
                    setCurrentPlaceId(pin._id);
                  }}
                />
              </Marker>
              {pin._id === currentPalceId && (
                <Popup
                  style={{ cursor: "pointer !important" }}
                  longitude={pin.long}
                  latitude={pin.lat}
                  anchor="left"
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p className="desc">{pin.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(parseInt(pin.rating)).fill(
                        <StarFill className="star" />
                      )}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{pin.username}</b>
                    </span>
                    {<span className="date">{format(pin.createdAt)}</span>}
                  </div>
                </Popup>
              )}
              {newPalce && (
                <>
                  <Marker latitude={newPalce.lat} longitude={newPalce.lng}>
                    <GeoAltFill
                      style={{ color: "tomato", fontSize: fontSize }}
                    />
                  </Marker>
                  <Popup
                    longitude={newPalce.lng}
                    latitude={newPalce.lat}
                    anchor="left"
                  >
                    <div>
                      <form onSubmit={handleSubmit}>
                        <label>Title</label>
                        <input
                          placeholder="Enter a title"
                          autoFocus
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <label>username</label>
                        <input
                          placeholder="Enter a username"
                          autoFocus
                          onChange={(e) => {
                            setCurrentUsername(e.target.value);
                            localStorage.setItem("user", e.target.value);
                          }}
                        />
                        <label>Description</label>
                        <textarea
                          placeholder="Say us something about this place."
                          onChange={(e) => setDesc(e.target.value)}
                        />
                        <label>Rating</label>
                        <select onChange={(e) => setStar(e.target.value)}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <button type="submit" className="submitButton">
                          Add Pin
                        </button>
                      </form>
                    </div>
                  </Popup>
                </>
              )}
            </div>
          );
        })}
      </Map>
    </div>
  );
}

export default App;
/*

*/
