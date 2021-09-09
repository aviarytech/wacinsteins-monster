import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, WsResponse, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class MsgGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server
  private logger: Logger = new Logger('MsgGateway')

  afterInit(server: Server) {
    this.logger.log("bloody websocket init")
  }

  handleConnection(client: Socket, ...args: any[]) {
    //ids are unique and different each time a user connects
    this.logger.log(`Client connected ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`)
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.logger.log(`Received msg from Client: ${client.id} in ${message.room}; msg: ${message.message}`)
    this.server.to(message.room).emit('chatToClient', message);
    this.logger.log(`Server is emitting to ${message.room}; msg: ${message.message} originally from ${client.id}`)

  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    this.logger.log(`Client: ${client.id} joined ${room}`)
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    this.logger.log(`Client: ${client.id} left ${room}`)
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
