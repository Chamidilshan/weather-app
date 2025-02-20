import WeatherSkelton from '@/components/loadingSkelton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button'
import { useGeoLocation } from '@/hooks/useGeoLocation'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '@/hooks/useWeather';
import { AlertTriangle, MapPin, RefreshCcw } from 'lucide-react'

const WeatherDashboard = () => {

  const { coordinates, error: locationError, getLocation, isLoading: locationLoading} = useGeoLocation();

  const locationApiQuery = useReverseGeocodeQuery(coordinates);
  const forecastApiQuery = useForecastQuery(coordinates);
  const weatherApiQuery = useWeatherQuery(coordinates);

  console.log(weatherApiQuery.data);



  const handleRefresh = () =>{
    getLocation();
    if(coordinates){
      weatherApiQuery.refetch();
      forecastApiQuery.refetch();
      locationApiQuery.refetch();
    }
  };

  if(locationLoading){
    return <WeatherSkelton/>
  }

  if(locationError){
    return <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Location Error</AlertTitle>
    <AlertDescription className='flex flex-col gap-4'>
      <p>{locationError}</p>
      <Button onClick={getLocation} variant={"outline"} className='w-fit'>
        <MapPin className='mr-2 h-4 w-4'/>
        Enable Location
      </Button>
    </AlertDescription>
  </Alert>
  }

  const locationName = locationApiQuery.data?.[0];

  if(weatherApiQuery.error || forecastApiQuery.error){
    return <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className='flex flex-col gap-4'>
      <p> Failed to fetch weather data. Please try again.</p>
      <Button onClick={handleRefresh} variant={"outline"} className='w-fit'>
        <RefreshCcw className='mr-2 h-4 w-4'/>
      </Button>
    </AlertDescription>
  </Alert>
  }



  if(!coordinates){
    return <Alert variant="destructive">
    <AlertTitle>Location Required</AlertTitle>
    <AlertDescription className='flex flex-col gap-4'>
      <p>{locationError}</p>
      <Button onClick={getLocation} variant={"outline"} className='w-fit'>
        <MapPin className='mr-2 h-4 w-4'/>
        Please enable location permison
      </Button>
    </AlertDescription>
  </Alert>
  }

  if(!weatherApiQuery.data || !forecastApiQuery.data){
    return <WeatherSkelton/>
  }


  return (
    <div className='space-y-4'>
      {/* Favourite Cities */}
      
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
        <Button 
        variant={'outline'}
        onClick={handleRefresh}
        disabled={weatherApiQuery.isFetching || forecastApiQuery.isFetching}
        size={"icon"}>
          <RefreshCcw className={`h-4 w-4 ${weatherApiQuery.isFetching ? "animate-spin" : ""}`}/>
        </Button>
      </div>
      
      {/* Xurrent and hourly weather */}
    </div>
  )
}

export default WeatherDashboard