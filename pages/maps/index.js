import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet-universal";

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: false,
    };
  }
  componentDidMount() {
    this.setState(() => ({ foo: true }));
  }
  render() {
    const position = [51.505, -0.09];
    let myIcon;
    return (
      <div>
        <Head>
          <title>Maps</title>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css"
          />
        </Head>
        <h1>Maps</h1>
        {this.state.foo && (
          <Map
            center={position}
            zoom={2}
            style={{
              height: "600px",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {this.props.posts.map((post, index) => {
              const L = require("leaflet");
              myIcon = L.icon({
                iconUrl: post.user.profile_picture_url,
                iconSize: [16, 16],
                iconAnchor: [16, 16],
                popupAnchor: null,
                shadowUrl: null,
                shadowSize: null,
                shadowAnchor: null,
              });
              return (
                post.place && (
                  <Marker
                    icon={myIcon}
                    key={index}
                    position={[post.place.lat, post.place.lng]}
                  >
                    <Popup>{post.place.name}</Popup>
                  </Marker>
                )
              );
            })}
          </Map>
        )}
        <h2>
          <Link href="/">
            <a>Back to home</a>
          </Link>
        </h2>
        <ul>
          {this.props.posts.map((post, index) => {
            return post.place && <li key={index}>{post.place.name} - {post.country && <strong>{post.country.name}</strong>}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const posts = await axios.get("http://localhost:3001/posts");
  return {
    props: {
      posts: posts.data,
    },
  };
}
