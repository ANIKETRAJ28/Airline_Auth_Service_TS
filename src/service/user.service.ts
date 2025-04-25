import { IUser } from '../interface/user.interface';
import { UserRepository } from '../repository/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<Omit<IUser, 'password'>> {
    try {
      const user = await this.userRepository.getUserById(id);
      return user;
    } catch (error) {
      console.error('Error in UserService: getUserById:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<Omit<IUser, 'password'>> {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      console.error('Error in UserService: getUserByEmail:', error);
      throw error;
    }
  }

  async createUser(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<Omit<IUser, 'password'>> {
    try {
      const newUser = await this.userRepository.createUser(user);
      return newUser;
    } catch (error) {
      console.error('Error in UserService: createUser:', error);
      throw error;
    }
  }

  async isUserAdmin(id: string): Promise<boolean> {
    try {
      const user = await this.userRepository.isUserAdmin(id);
      return user;
    } catch (error) {
      console.error('Error in UserService: isUserAdmin:', error);
      throw error;
    }
  }
}
