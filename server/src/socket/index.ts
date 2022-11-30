import { _buildings } from './../controllers/building.controller';
import { Server } from 'http'
import * as socketIo from 'socket.io'

export class Socket {
  public io: socketIo.Server

  constructor(server: Server) {
    this.io = new socketIo.Server(server, {
      cors: {
        origin: process.env.API_URL,
      }
    })
    this.connect()
  }

  public connect() {
    this.io.on('connection', (client: socketIo.Socket) => {
      // tslint:disable-next-line: no-console
      console.info(` connected : ${client.id}`)
      this.handlers(client)
    })
  }

  public handlers(client: socketIo.Socket) {
    client.on('disconnect', () => {
      // tslint:disable-next-line: no-console
      console.info(`Socket disconnected : ${client.id}`)
    })

    client.on('building:fetch', (buildingId) => {
      console.info(`building:fetch : ${client.id}`);

      setInterval(() => {
        const building = _buildings.find(building => building.id === Number(buildingId));
        client.emit('building:status_update', building)
      }, 1000);
    })
  }
}
