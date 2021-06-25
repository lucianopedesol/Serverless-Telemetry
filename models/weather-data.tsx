export class WeatherData {
    public temperature: Number;
    public temperatureFeelsLike: Number;
    public temperatureMin: Number;
    public temperatureMax: Number;
    public pressure: Number;
    public humidity: Number;

    public windSpeed: Number;
    public windDeg: Number;

    public weatherDescription: Number;

    toModel(entity): WeatherData {
        if (entity) {
            this.temperature = entity.temperature;
            this.temperatureFeelsLike = entity.temperatureFeelsLike;
            this.temperatureMin = entity.temperatureMin;
            this.temperatureMax = entity.temperatureMax;
            this.pressure = entity.pressure;
            this.humidity = entity.humidity;
            this.windSpeed = entity.windSpeed;
            this.windDeg = entity.windDeg;
            this.weatherDescription = entity.weatherDescription;
        }

        return this;
    }
}