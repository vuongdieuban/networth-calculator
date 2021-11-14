export class LiabilityServiceMock {
  findLiabilityProfileByUser = jest.fn();
  createInitialLiabilityProfile = jest.fn();
  calculateTotalLiabilityValue = jest.fn();
  updateLiabilityWithNewRateAndInput = jest.fn();
}
