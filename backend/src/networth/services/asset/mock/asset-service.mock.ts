export class AssetServiceMock {
  findAssetProfileByUser = jest.fn();
  createInitialAssetProfile = jest.fn();
  calculateTotalAssetValue = jest.fn();
  updateAssetWithNewRateAndInput = jest.fn();
}
