import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({type:'text',nullable:false})
  id: string;

  @Column({type:'text',nullable:false})
  name: string;

  @Column({type:'text',nullable:false})
  room: string;

  @Column({type:'text',nullable:false})
  initials: string;

  // Add more properties as needed

  // Optionally, define relationships with other entities
}