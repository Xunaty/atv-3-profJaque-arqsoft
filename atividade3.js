class EconomyFare {
  calculateFare(distanceKm) {
    return distanceKm * 2.50;
  }
}

class PremiumFare {
  calculateFare(distanceKm) {
    return distanceKm * 4.00 + 5.00;
  }
}

class RideCalculator {
  #strategy;

  constructor(strategy) {
    this.#strategy = strategy;
  }

  setStrategy(strategy) {
    this.#strategy = strategy;
  }

  calculate(distanceKm) {
    return this.#strategy.calculateFare(distanceKm);
  }
}

class AvailableState {
  handleRequest(driverContext) {
    console.log("Corrida aceita! Alterando estado do motorista para 'Em Rota'...");
    driverContext.setState(new InTransitState());
  }
}

class InTransitState {
  handleRequest(driverContext) {
    console.log("Motorista indisponível: Já existe uma corrida em andamento.");
  }
}

class DriverContext {
  #state;

  constructor(initialState) {
    this.#state = initialState;
  }

  setState(state) {
    this.#state = state;
  }

  requestRide() {
    this.#state.handleRequest(this);
  }
}
class LocationPublisher {
  #observers = [];

  subscribe(observer) {
    this.#observers.push(observer);
  }

  unsubscribe(observer) {
    this.#observers = this.#observers.filter(obs => obs !== observer);
  }

  notify(location) {
    this.#observers.forEach(observer => observer.update(location));
  }
}

class PassengerAppNotifier {
  update(location) {
    console.log(`[App Passageiro] Motorista atualizou a localização para: ${location}`);
  }
}
//
class CentralMonitoringNotifier {
  update(location) {
    console.log(`[Painel Central] Rastreamento GPS atualizado: ${location}`);
  }
}
//
const calculator = new RideCalculator(new EconomyFare());
console.log("Valor Corrida Econômica (10km): R$", calculator.calculate(10));
//
calculator.setStrategy(new PremiumFare());
console.log("Valor Corrida Premium (10km): R$", calculator.calculate(10));
//
const driver = new DriverContext(new AvailableState());
driver.requestRide(); // Aceita e muda estado
driver.requestRide(); // Recusa pois já está em rota
//
const publisher = new LocationPublisher();
publisher.subscribe(new PassengerAppNotifier());
publisher.subscribe(new CentralMonitoringNotifier());

publisher.notify("-1.4557, -48.4902");
