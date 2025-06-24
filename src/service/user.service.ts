import { IUserData } from '../interface/user.interface';
import { UserRepository } from '../repository/user.repository';
import { IUserRole } from '../types/user.type';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<IUserData> {
    return await this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<IUserData> {
    return await this.userRepository.getUserByEmail(email);
  }

  async registerUser(email: string): Promise<string> {
    return await this.userRepository.registerUser(email);
  }

  async verifyOtp(email: string, otp: string): Promise<IUserData> {
    return await this.userRepository.verifyOtp(email, otp);
  }

  async createUser(email: string, role: IUserRole): Promise<IUserData> {
    return await this.userRepository.createUser(email, role);
  }

  async loginViaPassword(email: string, password: string): Promise<IUserData> {
    return await this.userRepository.loginUserViaPassword(email, password);
  }

  async sendLoginOTP(email: string): Promise<void> {
    await this.userRepository.sendLoginOTP(email);
  }

  async loginViaOTP(email: string, otp: string): Promise<IUserData> {
    return await this.userRepository.loginUserViaOTP(email, otp);
  }

  async isUserAdmin(id: string): Promise<boolean> {
    return await this.userRepository.isUserAdmin(id);
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    await this.userRepository.updateUserPassword(id, password);
  }
}
