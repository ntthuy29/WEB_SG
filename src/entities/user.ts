import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    name?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email?: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    avatar_url?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    status?: string;

    @Column({ type: 'boolean', default: false })
    is_deleted?: boolean;

    @Column({ type: 'boolean', default: true })
    is_active?: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
    
    @Column({ type: 'varchar', length: 1024, nullable: true })
    refreshToken?: string | null;
}