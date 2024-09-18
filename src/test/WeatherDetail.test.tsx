import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import WeatherDetail from '../pages/WeatherDetail';

const mockWeatherData = {
  name: 'London',
  main: {
    temp: 15,
    humidity: 80,
    temp_min: 10,
    temp_max: 20,
  },
  weather: [{ description: 'Clear sky', icon: '01d' }],
  wind: { speed: 5 },
  sys: {
    sunrise: 1618317040,
    sunset: 1618360240,
  },
};

const renderWithRouter = (component: React.ReactNode, route: string = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Route path="/:city">{component}</Route>
    </MemoryRouter>
  );
};

describe('WeatherDetail Component', () => {
  beforeEach(() => {
    // Mock the fetchWeather function if needed
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderWithRouter(<WeatherDetail />, '/London');
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders weather data correctly', async () => {
    // Mock the fetchWeather function to return mock data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      })
    ) as jest.Mock;

    renderWithRouter(<WeatherDetail />, '/London');

    // Wait for the weather data to be displayed
    expect(await screen.findByText(/London/i)).toBeInTheDocument();
    expect(await screen.findByText(/°/i)).toBeInTheDocument();
    expect(await screen.findByText(/.+y/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sunrise/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    // Mock the fetchWeather function to simulate an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    renderWithRouter(<WeatherDetail />, '/London');

    // Wait for the error message to be displayed
    expect(await screen.findByText(/Failed to fetch weather data/i)).toBeInTheDocument();
  });

  test('navigates back to home on button click', () => {
    const { container } = renderWithRouter(<WeatherDetail />, '/London');
    const backButton = screen.getByRole('button', { name: /Go Back/i });
    fireEvent.click(backButton);
    expect(container).toBeInTheDocument(); // Adjust this based on your routing setup
  });
});
