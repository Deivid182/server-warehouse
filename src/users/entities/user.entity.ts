
export class UserEntity {
  public id: string;
  public email: string;
  role: 'employee' | 'warehouseman';
  createdAt: Date;
  updatedAt: Date;
}