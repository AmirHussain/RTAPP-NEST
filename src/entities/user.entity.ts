import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({type:'text',nullable:false})
  name: string;

  @Column({type:'text',nullable:true})
  password: string;

  @Column({type:'text',nullable:true})
  email: string;

  @Column({type:'text',nullable:false})
  initials: string;

  // Add more properties as needed

  // Optionally, define relationships with other entities
}