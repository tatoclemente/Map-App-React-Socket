

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
  const { coords, setRef, newMarker$, markerMovement$, addMarker, updateMarker } = useMapBox( initialPoint )

  // Escuchar marcadores Activos
  useEffect(() => {

    socket.on('active-markers', (markers) => {
      for( const key of Object.keys( markers ) ) {
        addMarker(markers[key], key)
      }
    })

  }, [socket, addMarker])

  useEffect(() => {

    newMarker$.subscribe( marker => {
      // nuevo marcador emitir
      socket.emit('new-marker', marker)
    })

    return () => {
      newMarker$.unsubscribe()
    } 

  }, [newMarker$, socket])




  useEffect(() => {

    markerMovement$.subscribe( marker => {
      socket.emit('update-marker', marker)
    })
  }, [markerMovement$, socket])


  useEffect(() => {
    socket.on('new-marker', marker => {
      // console.log(marker)
      addMarker(marker, marker.id) // agregar nuevo marcador
    })

    return () => {
      socket.off('new-marker')
    }

  }, [socket])

  // Mover el marcador mediante sockets
  useEffect(() => {
    socket.on('update-marker', ( marker ) => {
      updateMarker( marker ) 
    })

  }, [socket])


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
