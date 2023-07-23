import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class UserRoomSessions {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', nullable: false })
  room_id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'text', nullable: true })
  user_session_id: string;

  @Column({ type: 'timestamptz', nullable: true })
  date_created: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_removed: Date;

  // Add more properties as needed
  // Optionally, define relationships with other entities

}