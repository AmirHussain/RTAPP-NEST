import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class UserRoom {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({type:'integer',nullable:true})
  user_id: number;

  @Column({type:'text',nullable:true})
  room: string;

  
  // Add more properties as needed

  // Optionally, define relationships with other entities
}