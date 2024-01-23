const Markers = require("./markers");


class Sockets {

  constructor( io ) {

    this.io = io;

    this.markers = new Markers()

    this.socketsEventes();
    
  }

  socketsEventes() {

    // On connection
    this.io.on('connection', ( socket ) => { 


      // Marcadores activos
      socket.emit('active-markers', this.markers.actives);

      // Marcador nuevo
      socket.on('new-marker', ( marker ) => {

        this.markers.addMarker( marker );

        socket.broadcast.emit('new-marker', marker);
      })

      // Todo: Marcador actualizado
      socket.on('update-marker', ( marker ) => {
        this.markers.updateMarker( marker );
        socket.broadcast.emit('update-marker', marker);
      })
      
    }); 
  }

}


module.exports = Sockets;