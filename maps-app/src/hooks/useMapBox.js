
import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs'; // Observable para suscribirme

mapboxgl.accessToken = 'pk.eyJ1IjoidGF0b2NsZW1lbnRlIiwiYSI6ImNscm9iaW4yczBpeGcya29iczh5aHZkaHUifQ.B5vxWJTusC3WQtLwwgHs_w';


export const useMapBox = (initialPoint) => {

  const mapDiv = useRef()
  const setRef = useCallback(node => {
    mapDiv.current = node; // guarda el nodo en el que se renderizó el mapa
  }, [])

  // Referencia a los marcadores
  const markers = useRef({}) 

  // Observables de Rxjs
  const markerMovement = useRef( new Subject() );
  const newMarker = useRef( new Subject() );


  const map = useRef(null) // para que no se reinicie el mapa cada vez que se renderice
  const [coords, setCords] = useState(initialPoint)

  // Funcion para agregar marcadores
  const addMarker = useCallback((ev, id) => { // (e.lngLat)

    const { lng, lat } = ev.lngLat || ev
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current)
      .setDraggable(true)


    marker.id = id ?? uuidv4() 

    // Asignamos al objeto de marcadores
    markers.current[ marker.id ] = marker

    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      })
    }

    // Escuchar movimientos del marcador
    marker.on('drag', ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()

      // Emitir los cambos del marcador
      markerMovement.current.next({
        id,
        lng,
        lat,
      })

    })

  }, [])


  // Funcion para actualizar el marcador
  const updateMarker = useCallback((marker) => {
    const { id, lng, lat } = marker
    markers.current[id].setLngLat([lng, lat])
  }, [])

  useEffect(() => {

    const mapBox = new mapboxgl.Map({
      container: mapDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialPoint.lng, initialPoint.lat],
      zoom: initialPoint.zoom,
    });

    map.current = mapBox

  }, [initialPoint])

  useEffect(() => {
    map.current?.on('move', () => {

      const { lng, lat } = map.current.getCenter()
      setCords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      })
    })
  }, [])

  // Agregar un marcador al mapa cuando hago click
  useEffect(() => {
    map.current?.on( 'click', addMarker ) // El evento que se emite pasa directamente a la funcion

  }, [addMarker])

  return {
    addMarker,
    updateMarker,
    coords,
    setRef,
    markers,
    newMarker$: newMarker.current,
    markerMovement$: markerMovement.current,
  }
}
