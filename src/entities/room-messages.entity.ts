import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class RoomMessages {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({type:'text',nullable:true})
  user_socket_id: string;


  @Column({type:'text',nullable:false})
  message: string;

  
  @Column({type:'text',nullable:true})
  type: string;

  @Column({type:'timestamptz',nullable:false})
  date_created: Date;

  
  // Add more properties as needed

  // Optionally, define relationships with other entities
}