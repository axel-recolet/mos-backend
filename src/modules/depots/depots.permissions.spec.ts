import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { fakeUser, IUser } from '../users';
import { fakeDepot } from './depot.fake';
import { DepotsPermission } from './depots.permission';

describe('DepotsPermission', () => {
  let permisService: DepotsPermission;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DepotsPermission],
    }).compile();

    permisService = moduleRef.get(DepotsPermission);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createDepot', () => {
    it("should throw an error when the user hasn't credit card", async () => {
      const user: IUser = fakeUser({ creditCard: undefined });
      const result = permisService.createDepot(user);
      expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should return true when the user has a credit card', async () => {
      const user: IUser = fakeUser();
      const result = await permisService.createDepot(user);
      expect(result).toBeTruthy();
    });
  });

  describe('getDepot', () => {
    it('should throw an ForbiddenException when user is not linked to the depot', async () => {
      const user = fakeUser();
      const depot = fakeDepot();

      const result = permisService.getDepot(user, depot);

      expect(result).rejects.toThrow(ForbiddenException);
    });

    it("should return true when user is the depot's creator", async () => {
      const user = fakeUser();
      const depot = fakeDepot({ creator: user.email });
      user.depots.push(depot);

      const result = await permisService.getDepot(user, depot);

      expect(result).toBeTruthy();
    });

    it("should return true when user is a depot's admin", async () => {
      const user = fakeUser();
      const depot = fakeDepot();
      depot.admins.push(user.email);
      user.depots.push(depot);

      const result = await permisService.getDepot(user, depot);

      expect(result).toBeTruthy();
    });

    it("should return true when user is a depot's user", async () => {
      const user = fakeUser();
      const depot = fakeDepot();
      depot.users.push(user.email);
      user.depots.push(depot);

      const result = await permisService.getDepot(user, depot);

      expect(result).toBeTruthy();
    });
  });
});
