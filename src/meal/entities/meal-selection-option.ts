import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MealSelection } from './meal-selection';

@Entity()
export class MealSelectionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MealSelection, (selection) => selection.options)
  selection: MealSelection;

  @Column()
  name: string;

  @Column()
  price: number;
}
