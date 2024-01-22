

import { useContext, useEffect } from 'react';
import { useMapBox } from '../hooks/useMapBox';
import { SocketContext } from '../context/SocketContext';


const initialPoint = {
  lng: -122.4612,
  lat: 37.801,
  zoom: 13.5,
}


export const MapPage = () => {

  const { socket } = useContext( SocketContext )

  const { coords, setRef, newMarker$, markerMovement$ } = useMapBox( initialPoint )

  useEffect(() => {

    newMarker$.subscribe( marker => {
      // Todo: nuevo marcador emitir

    })

    return () => {
      newMarker$.unsubscribe()
    } 

  }, [newMarker$])


  useEffect(() => {

    markerMovement$.subscribe( marker => {
      
    })
  }, [markerMovement$])


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
