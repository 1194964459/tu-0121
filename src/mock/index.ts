import userMock from './modules/user';
import orderMock from './modules/order';
import productionMock from './modules/production';
import warehousingMock from './modules/warehousing';
import carrierMock from './modules/carrier';
import dispatchMock from './modules/dispatch';
import vesselMock from './modules/vessel';
import customsMock from './modules/customs';
import trackingMock from './modules/tracking';

const mockModules = {
  user: userMock,
  order: orderMock,
  production: productionMock,
  warehousing: warehousingMock,
  carrier: carrierMock,
  dispatch: dispatchMock,
  vessel: vesselMock,
  customs: customsMock,
  tracking: trackingMock
};

export function setupMock() {
  console.log('Mock is enabled with modules:', Object.keys(mockModules));
  return Object.values(mockModules).flat();
}
