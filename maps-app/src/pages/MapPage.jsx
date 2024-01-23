
import { useSocketMapBox } from '../hooks/useSocketMapBox';


const initialPoint = {
  lng: -122.4612,
  lat: 37.801,
  zoom: 13.5,
}


export const MapPage = () => {

  const { coords, setRef } = useSocketMapBox( initialPoint )

  


  return (
    <>

      <div className='info'>
        Lng: { coords.lng } | Lat: { coords.lat } | Zoom: { coords.zoom }
      </div>
      <div
      ref={ setRef }
        className='mapContainer'
      />
    </>
  )
}
