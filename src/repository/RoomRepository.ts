/**
 * Repository thao tác với dữ liệu Phòng (rooms) và Loại phòng (roomTypes)
 * Nơi duy nhất gọi apiRequest() cho thực thể Room
 */

import { Room, RoomType, RoomStatus } from '../entities/Room';
import { apiRequest } from './apiConfig';

export class RoomRepository {
  public async findAllRooms(): Promise<Room[]> {
    return apiRequest<Room[]>('/rooms');
  }

  public async findRoomById(id: string): Promise<Room | null> {
    try {
      return await apiRequest<Room>(`/rooms/${id}`);
    } catch (err: any) {
      if (err.code === 'HTTP_404') return null;
      throw err;
    }
  }

  public async findRoomByNumber(roomNumber: string): Promise<Room | null> {
    const list = await apiRequest<Room[]>(`/rooms?roomNumber=${encodeURIComponent(roomNumber)}`);
    return list.length > 0 ? list[0] : null;
  }

  public async findAllRoomTypes(): Promise<RoomType[]> {
    return apiRequest<RoomType[]>('/roomTypes');
  }

  public async findRoomTypeById(id: string): Promise<RoomType | null> {
    try {
      return await apiRequest<RoomType>(`/roomTypes/${id}`);
    } catch (err: any) {
      if (err.code === 'HTTP_404') return null;
      throw err;
    }
  }

  public async createRoom(room: Room): Promise<Room> {
    return apiRequest<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  public async updateRoom(id: string, partial: Partial<Room>): Promise<Room> {
    return apiRequest<Room>(`/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partial),
    });
  }

  public async deleteRoom(id: string): Promise<void> {
    await apiRequest<void>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  public async updateRoomStatus(id: string, status: RoomStatus): Promise<Room> {
    return this.updateRoom(id, { status });
  }
}
