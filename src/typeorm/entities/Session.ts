import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryColumn()
  sessionId: string;

  @Column()
  expiresAt: Date;

  @Column('text')
  data: string;
}
