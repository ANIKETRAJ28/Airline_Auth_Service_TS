import { IUserData } from '../interface/user.interface';
import { UserRepository } from '../repository/user.repository';
import { IUserRole } from '../types/user.type';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<IUserData> {
    try {
      const user = await this.userRepository.getUserById(id);
      return user;
    } catch (error) {
      console.error('Error in UserService: getUserById:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUserData> {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      console.error('Error in UserService: getUserByEmail:', error);
      throw error;
    }
  }

  async registerUser(email: string): Promise<string> {
    try {
      const userEmail = await this.userRepository.registerUser(email);
      return userEmail;
    } catch (error) {
      console.error('Error in UserService: registerUser:', error);
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<IUserData> {
    try {
      const user = await this.userRepository.verifyOtp(email, otp);
      return user;
    } catch (error) {
      console.error('Error in UserService: verifyOtp:', error);
      throw error;
    }
  }

  async createUser(email: string, role: IUserRole): Promise<IUserData> {
    try {
      const newUser = await this.userRepository.createUser(email, role);
      return newUser;
    } catch (error) {
      console.error('Error in UserService: createUser:', error);
      throw error;
    }
  }

  async loginViaPassword(email: string, password: string): Promise<IUserData> {
    try {
      const user = await this.userRepository.loginUserViaPassword(email, password);
      return user;
    } catch (error) {
      console.error('Error in UserService: loginViaPassword:', error);
      throw error;
    }
  }

  async sendLoginOTP(email: string): Promise<void> {
    try {
      await this.userRepository.sendLoginOTP(email);
    } catch (error) {
      console.error('Error in UserService: sendLoginOTP:', error);
      throw error;
    }
  }

  async loginViaOTP(email: string, otp: string): Promise<IUserData> {
    try {
      const user = await this.userRepository.loginUserViaOTP(email, otp);
      return user;
    } catch (error) {
      console.error('Error in UserService: loginViaOTP:', error);
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

  async updateUserPassword(id: string, password: string): Promise<void> {
    try {
      await this.userRepository.updateUserPassword(id, password);
      return;
    } catch (error) {
      console.error('Error in UserService: updateUserPassword:', error);
      throw error;
    }
  }
}
