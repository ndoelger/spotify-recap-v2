import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
} from "../spotify";
import {
  SectionWrapper,
  ArtistsGrid,
  TrackList,
  PlaylistsGrid,
  Loader,
} from "../components";
import { StyledHeader } from "../styles";
import "../styles/profile.css"

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const userProfile = await getCurrentUserProfile();
      console.log(userProfile.data);
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      console.log(userPlaylists.data);
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      console.log(userTopArtists.data);
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks();
      console.log(userTopTracks.data);
      setTopTracks(userTopTracks.data);
    }

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[1].url && (
                <img
                  className="header__img"
                  src={profile.images[1].url}
                  alt="Avatar"
                />
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>
                      {playlists.total} Playlist
                      {playlists.total !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span>
                    {profile.followers.total} Follower
                    {profile.followers.total !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            {topArtists && topTracks && playlists ? (
              <>
                <SectionWrapper
                  title="Top artists this month"
                  seeAllLink="/top-artists">
                  <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
                </SectionWrapper>

                <SectionWrapper
                  title="Top tracks this month"
                  seeAllLink="/top-tracks">
                  <TrackList tracks={topTracks.items.slice(0, 10)} />
                </SectionWrapper>

                <SectionWrapper
                  title="Public Playlists"
                  seeAllLink="/playlists">
                  <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
                </SectionWrapper>
              </>
            ) : (
              <>
                <Loader />
                <h1 style={{textAlign:"center", padding: "29px", marginTop: "-100px", color: "grey"}}> Note: This is a demo app. In order to gain API access, please email doelgern@gmail.com with your name and login email.</h1>
              </>
            )}
          </main>
        </>
      )}
    </>
  );
}
